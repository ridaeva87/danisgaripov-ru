import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { getConfig } from "./config.mjs";
import {
  FINANCIAL_PACKAGES,
  MAIN_MENU,
  SERVICES,
  STATUS_LABELS,
  WELCOME_TEXT,
  buildAdminStatusKeyboard,
  buildBackMenuKeyboard,
  buildFinancialKeyboard,
  buildMainMenuKeyboard,
  buildServiceKeyboard,
  buildWelcomeKeyboard,
  formatClientStartMessage,
  formatRequestSummary,
  normalizePayload,
  serviceKeyFromText,
} from "./messages.mjs";
import { RequestStore } from "./store.mjs";
import { TelegramApi } from "./telegram-api.mjs";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set(["application/pdf", "image/jpeg", "image/png", "audio/ogg", "video/mp4", "video/quicktime"]);
const ALLOWED_EXTENSIONS = [".pdf", ".jpg", ".jpeg", ".png"];
const userModes = new Map();

const sleep = (ms) => new Promise((resolveSleep) => setTimeout(resolveSleep, ms));

const loadDotEnv = async () => {
  const envPath = resolve(rootDir, ".env");
  try {
    const raw = await readFile(envPath, "utf8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
      const [key, ...valueParts] = trimmed.split("=");
      if (!process.env[key]) {
        process.env[key] = valueParts.join("=").trim();
      }
    }
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
};

const getClient = (message) => ({
  chatId: message.chat.id,
  name: [message.from?.first_name, message.from?.last_name].filter(Boolean).join(" "),
  username: message.from?.username || "",
});

const formatTelegramIdentity = (client = {}) => (
  client.username ? `@${client.username}` : client.telegramName || client.name || String(client.chatId || "-")
);

const adminHelp = [
  "Команды для группы администраторов:",
  "/info REQ-00001 - показать заявку",
  "/status REQ-00001 collecting|assigned|in_progress|waiting_client|ready|closed - изменить статус",
  "/reply REQ-00001 текст - отправить сообщение клиенту",
  "/result REQ-00001 текст - отправить результат клиенту",
  "/close REQ-00001 - закрыть заявку",
].join("\n");

const clientHelp = [
  "Выберите раздел в главном меню.",
  "Команда Даниса увидит только ваши заявки, сообщения и документы.",
].join("\n");

const parseCommand = (text = "") => {
  const [command = "", requestId = "", ...rest] = text.trim().split(/\s+/);
  return {
    command: command.toLowerCase(),
    requestId: requestId.toUpperCase(),
    rest: rest.join(" ").trim(),
  };
};

const notifyAdminAboutRequest = async ({ api, config, store, request }) => {
  const adminMessage = await api.sendMessage({
    chatId: config.adminChatId,
    text: [
      "Новая заявка с сайта",
      "",
      formatRequestSummary(request),
      "",
      adminHelp,
    ].join("\n"),
    replyMarkup: buildAdminStatusKeyboard(request.id),
  });
  await store.mapAdminMessage(adminMessage?.message_id, request.id);
};

const showWelcome = async ({ api, config, message }) => {
  await api.sendPhoto({
    chatId: message.chat.id,
    photo: `${config.publicSiteUrl}/bot/welcome.png`,
    caption: WELCOME_TEXT,
    replyMarkup: buildWelcomeKeyboard(config.publicSiteUrl),
  });
};

const showMainMenu = async ({ api, chatId }) => {
  await api.sendMessage({
    chatId,
    text: "Главное меню. Выберите, что нужно сделать.",
    replyMarkup: buildMainMenuKeyboard(),
  });
};

const startRequest = async ({ api, config, store, message, serviceKey }) => {
  const request = await store.createRequest({
    serviceKey,
    client: getClient(message),
  });

  await api.sendMessage({
    chatId: message.chat.id,
    text: formatClientStartMessage(serviceKey, config.publicSiteUrl),
    replyMarkup: buildBackMenuKeyboard(),
  });
  await notifyAdminAboutRequest({ api, config, store, request });

  return request;
};

const describeAttachment = (message) => {
  if (message.document) {
    return {
      type: "document",
      fileId: message.document.file_id,
      fileName: message.document.file_name || "",
      mimeType: message.document.mime_type || "",
      fileSize: message.document.file_size || 0,
    };
  }

  if (message.photo?.length) {
    const photo = message.photo.at(-1);
    return {
      type: "photo",
      fileId: photo.file_id,
      fileName: "photo",
      mimeType: "image/jpeg",
      fileSize: photo.file_size || 0,
    };
  }

  if (message.voice) {
    return {
      type: "voice",
      fileId: message.voice.file_id,
      fileName: "voice.ogg",
      mimeType: message.voice.mime_type || "audio/ogg",
      fileSize: message.voice.file_size || 0,
    };
  }

  if (message.video) {
    return {
      type: "video",
      fileId: message.video.file_id,
      fileName: message.video.file_name || "video.mp4",
      mimeType: message.video.mime_type || "video/mp4",
      fileSize: message.video.file_size || 0,
    };
  }

  return null;
};

const isAllowedAttachment = (attachment) => {
  if (!attachment) return false;
  const fileName = attachment.fileName.toLowerCase();
  const hasAllowedExtension = ["photo", "voice", "video"].includes(attachment.type) || ALLOWED_EXTENSIONS.some((extension) => fileName.endsWith(extension));
  const hasAllowedMime = !attachment.mimeType || ALLOWED_MIME_TYPES.has(attachment.mimeType);
  const hasAllowedSize = !attachment.fileSize || attachment.fileSize <= MAX_FILE_SIZE_BYTES;
  return hasAllowedExtension && hasAllowedMime && hasAllowedSize;
};

const getAuthor = (from = {}) => ({
  id: String(from.id || ""),
  name: [from.first_name, from.last_name].filter(Boolean).join(" ") || from.username || String(from.id || ""),
  username: from.username || "",
});

const changeAdminStatus = async ({ api, config, store, requestId, status, from }) => {
  const request = store.getRequest(requestId);
  if (!request) {
    await api.sendMessage({ chatId: config.adminChatId, text: `Заявка ${requestId} не найдена.` });
    return;
  }

  let updated = request;
  const author = getAuthor(from);
  if (status === "in_progress") {
    updated = await store.assignRequest(requestId, author);
    if (updated.assignedTo?.id !== author.id) {
      await api.sendMessage({
        chatId: config.adminChatId,
        text: `Заявка ${requestId} уже в работе у ${updated.assignedTo.name}.`,
      });
      return;
    }
  } else {
    updated = await store.setStatus(requestId, status);
  }

  await store.addAdminNote(requestId, { type: "status", author: author.name, text: status });
  const statusLine = [
    `Статус заявки ${requestId}: ${STATUS_LABELS[updated.status] || updated.status}`,
    `Сотрудник: ${author.name}`,
    `Дата: ${new Date().toISOString()}`,
  ].join("\n");

  const statusMessage = await api.sendMessage({ chatId: config.adminChatId, text: statusLine });
  await store.mapAdminMessage(statusMessage?.message_id, requestId);
  if (updated.client?.chatId) {
    await api.sendMessage({
      chatId: updated.client.chatId,
      text: `Статус вашей заявки ${updated.id}: ${STATUS_LABELS[updated.status] || updated.status}.`,
    });
  }
};

const handleBindPayload = async ({ api, config, store, message, token }) => {
  const result = await store.bindRequestToChat(token, getClient(message));

  if (!result.ok) {
    const textByReason = {
      used: "Эта ссылка уже была использована. Если нужно подключить Telegram заново, отправьте заявку ещё раз или свяжитесь с командой Даниса.",
      expired: "Срок действия ссылки истёк. Отправьте заявку на сайте ещё раз, чтобы получить новую ссылку.",
      request_not_found: "Заявка для этой ссылки не найдена. Отправьте заявку на сайте ещё раз.",
      not_found: "Ссылка недействительна. Проверьте, что вы перешли по кнопке после отправки заявки.",
    };
    await api.sendMessage({
      chatId: message.chat.id,
      text: textByReason[result.reason] || "Не удалось подключить Telegram к заявке. Отправьте заявку на сайте ещё раз.",
      replyMarkup: buildMainMenuKeyboard(),
    });
    return;
  }

  await store.rememberConsent({ chatId: message.chat.id });

  await api.sendMessage({
    chatId: message.chat.id,
    text: `Заявка ${result.request.id} подключена к Telegram. Команда Даниса свяжется с вами в этом чате. Здесь вы сможете получать сообщения и отправлять документы.`,
    replyMarkup: buildMainMenuKeyboard(),
  });

  const adminMessage = await api.sendMessage({
    chatId: config.adminChatId,
    text: [
      "✅ Telegram клиента подключён",
      `Номер заявки: ${result.request.id}`,
      `Имя клиента: ${result.request.client?.name || "-"}`,
      `Telegram: ${formatTelegramIdentity(result.request.client)}`,
      "Статус: можно отвечать через бота",
    ].join("\n"),
    replyMarkup: buildAdminStatusKeyboard(result.request.id),
  });
  await store.mapAdminMessage(adminMessage?.message_id, result.request.id);
};

const ensureAssignedManager = async ({ api, config, request, from }) => {
  const author = getAuthor(from);
  if (!request.assignedTo?.id) {
    await api.sendMessage({
      chatId: config.adminChatId,
      text: `Сначала возьмите заявку ${request.id} в работу, затем ответьте клиенту.`,
    });
    return false;
  }
  if (String(request.assignedTo.id) !== String(author.id)) {
    await api.sendMessage({
      chatId: config.adminChatId,
      text: `Заявка ${request.id} закреплена за ${request.assignedTo.name}. Ответ через бота доступен только ответственному менеджеру.`,
    });
    return false;
  }
  return true;
};

const handleAdminReplyMessage = async ({ api, config, store, message }) => {
  if ((message.text || "").startsWith("/")) return false;

  const repliedMessageId = message.reply_to_message?.message_id;
  if (!repliedMessageId) return false;

  const request = store.getRequestByAdminMessage(repliedMessageId);
  if (!request) return false;

  if (!(await ensureAssignedManager({ api, config, request, from: message.from }))) {
    return true;
  }

  if (!request.client?.chatId) {
    const warning = await api.sendMessage({
      chatId: config.adminChatId,
      text: "Клиент ещё не подключил Telegram к заявке. Ответ через бота пока невозможен.",
    });
    await store.mapAdminMessage(warning?.message_id, request.id);
    return true;
  }

  await store.addAdminNote(request.id, {
    type: "reply",
    author: message.from?.username || String(message.from?.id || ""),
    text: message.text || message.caption || "[файл]",
  });

  await api.copyMessage({
    chatId: request.client.chatId,
    fromChatId: config.adminChatId,
    messageId: message.message_id,
  });

  const confirmation = await api.sendMessage({
    chatId: config.adminChatId,
    text: `Сообщение отправлено клиенту по заявке ${request.id}.`,
  });
  await store.mapAdminMessage(message.message_id, request.id);
  await store.mapAdminMessage(confirmation?.message_id, request.id);
  return true;
};

const handleAdminMessage = async ({ api, config, store, message }) => {
  const text = message.text || "";

  if (await handleAdminReplyMessage({ api, config, store, message })) {
    return;
  }

  if (!text.startsWith("/")) {
    return;
  }

  const { command, requestId, rest } = parseCommand(text);

  if (command === "/help" || command === "/start") {
    await api.sendMessage({ chatId: config.adminChatId, text: adminHelp });
    return;
  }

  const request = store.getRequest(requestId);
  if (!request) {
    await api.sendMessage({ chatId: config.adminChatId, text: `Заявка ${requestId || ""} не найдена.` });
    return;
  }

  if (command === "/info") {
    await api.sendMessage({ chatId: config.adminChatId, text: formatRequestSummary(request) });
    return;
  }

  if (command === "/status") {
    const status = rest;
    if (!STATUS_LABELS[status]) {
      await api.sendMessage({
        chatId: config.adminChatId,
        text: `Неизвестный статус. Доступно: ${Object.keys(STATUS_LABELS).join(", ")}`,
      });
      return;
    }

    await changeAdminStatus({ api, config, store, requestId, status, from: message.from });
    return;
  }

  if (command === "/reply" || command === "/result") {
    if (!rest) {
      await api.sendMessage({ chatId: config.adminChatId, text: "Добавьте текст сообщения после номера заявки." });
      return;
    }
    if (!(await ensureAssignedManager({ api, config, request, from: message.from }))) {
      return;
    }

    const prefix = command === "/result" ? `Результат по заявке ${request.id}:\n\n` : "";
    await store.addAdminNote(requestId, {
      type: command === "/result" ? "result" : "reply",
      author: message.from?.username || String(message.from?.id || ""),
      text: rest,
    });

    if (command === "/result") {
      await store.setStatus(requestId, "ready");
    }

    if (!request.client.chatId) {
      await api.sendMessage({ chatId: config.adminChatId, text: `У заявки ${request.id} нет Telegram ID клиента.` });
      return;
    }

    await api.sendMessage({ chatId: request.client.chatId, text: `${prefix}${rest}` });
    const confirmation = await api.sendMessage({ chatId: config.adminChatId, text: `Сообщение отправлено клиенту по заявке ${request.id}.` });
    await store.mapAdminMessage(confirmation?.message_id, request.id);
    return;
  }

  if (command === "/close") {
    const updated = await store.setStatus(requestId, "closed");
    if (updated.client.chatId) {
      await api.sendMessage({
        chatId: updated.client.chatId,
        text: `Заявка ${updated.id} закрыта. Спасибо за обращение.`,
      });
    }
    await api.sendMessage({ chatId: config.adminChatId, text: `Заявка ${updated.id} закрыта.` });
    return;
  }

  await api.sendMessage({ chatId: config.adminChatId, text: adminHelp });
};

const handleCallbackQuery = async ({ api, config, store, callbackQuery }) => {
  const data = callbackQuery.data || "";
  const message = callbackQuery.message;
  const chatId = message?.chat?.id;

  if (data === "consent:accept") {
    await store.rememberConsent({ chatId: callbackQuery.from.id });
    await api.answerCallbackQuery({ callbackQueryId: callbackQuery.id, text: "Согласие сохранено" });
    await showMainMenu({ api, chatId: callbackQuery.from.id });
    return;
  }

  if (String(chatId) === String(config.adminChatId) && data.startsWith("admin:")) {
    const [, action, requestId, status] = data.split(":");
    await api.answerCallbackQuery({ callbackQueryId: callbackQuery.id, text: "Статус обновляется" });
    if (action === "take") {
      await changeAdminStatus({ api, config, store, requestId, status: "in_progress", from: callbackQuery.from });
      return;
    }
    if (action === "status") {
      await changeAdminStatus({ api, config, store, requestId, status, from: callbackQuery.from });
    }
    return;
  }

  if (data.startsWith("payment:check:")) {
    await api.answerCallbackQuery({ callbackQueryId: callbackQuery.id, text: "Проверяем оплату" });
    await api.sendMessage({
      chatId: callbackQuery.from.id,
      text: "Оплата пока не найдена. Проверьте данные заказа или свяжитесь с командой Даниса.",
      replyMarkup: buildMainMenuKeyboard(),
    });
  }
};

const sendFinancialReview = async ({ api, config, chatId }) => {
  const text = [
    "Финансовый разбор",
    "",
    ...FINANCIAL_PACKAGES.map((item) => `${item.title}\n${item.description}`).join("\n\n").split("\n"),
  ].join("\n");

  await api.sendMessage({
    chatId,
    text,
    replyMarkup: buildFinancialKeyboard(config.publicSiteUrl),
  });
  await api.sendMessage({ chatId, text: "Для возврата используйте кнопку ниже.", replyMarkup: buildBackMenuKeyboard() });
};

const sendCreditHistory = async ({ api, config, chatId }) => {
  await api.sendMessage({
    chatId,
    text: [
      "Диагностика кредитной истории",
      "",
      "После оплаты команда проверит кредитную историю и подскажет, что мешает одобрению.",
      "",
      "Кнопка «Я уже оплатил» не открывает загрузку документов без серверного подтверждения оплаты.",
      "Если оплата пока не найдена, бот попросит связаться с командой.",
    ].join("\n"),
    replyMarkup: {
      inline_keyboard: [
        [{ text: "Оформить диагностику", url: `${config.publicSiteUrl}/services/uluchshenie-kreditnoy-istorii` }],
        [{ text: "Я уже оплатил", callback_data: "payment:check:credit_history" }],
      ],
    },
  });
  await api.sendMessage({ chatId, text: "Для возврата используйте кнопку ниже.", replyMarkup: buildBackMenuKeyboard() });
};

const sendStatus = async ({ api, store, chatId }) => {
  const requests = store.getRequestsByChatId(chatId).filter((request) => request.status !== "closed");
  if (!requests.length) {
    await api.sendMessage({
      chatId,
      text: "По вашему Telegram-аккаунту активные заявки не найдены.",
      replyMarkup: buildBackMenuKeyboard(),
    });
    return;
  }

  await api.sendMessage({
    chatId,
    text: requests
      .map((request) => `${request.id} - ${SERVICES[request.serviceKey]?.adminTitle || request.serviceKey} - ${STATUS_LABELS[request.status] || request.status}`)
      .join("\n"),
    replyMarkup: buildBackMenuKeyboard(),
  });
};

const requestDocuments = async ({ api, store, chatId }) => {
  const request = store.getActiveRequest(chatId) || store.getRequestsByChatId(chatId)[0];
  if (!request) {
    await api.sendMessage({
      chatId,
      text: "По вашему Telegram-аккаунту активные заявки не найдены. Сначала выберите услугу или свяжитесь с командой.",
      replyMarkup: buildMainMenuKeyboard(),
    });
    return;
  }

  if (["credit_history", "financial_comfort", "financial_ultimate"].includes(request.serviceKey) && request.payment?.status !== "Оплата подтверждена") {
    await api.sendMessage({
      chatId,
      text: "Для этой услуги нужна подтверждённая оплата. Оплата пока не найдена. Проверьте данные заказа или свяжитесь с командой Даниса.",
      replyMarkup: buildMainMenuKeyboard(),
    });
    return;
  }

  userModes.set(String(chatId), { type: "documents", requestId: request.id });
  await api.sendMessage({
    chatId,
    text: [
      `Отправьте документы по заявке ${request.id}.`,
      "Разрешены форматы: PDF, JPG, JPEG, PNG.",
      "Максимальный размер файла: 15 МБ.",
    ].join("\n"),
    replyMarkup: buildBackMenuKeyboard(),
  });
};

const requestContact = async ({ api, store, chatId }) => {
  const request = store.getActiveRequest(chatId) || store.getRequestsByChatId(chatId)[0] || null;
  userModes.set(String(chatId), { type: "contact", requestId: request?.id || "" });
  await api.sendMessage({
    chatId,
    text: "Напишите вопрос команде Даниса. Мы передадим его в закрытую группу.",
    replyMarkup: {
      keyboard: [[{ text: "Отменить обращение" }], [{ text: "Назад в главное меню" }]],
      resize_keyboard: true,
    },
  });
};

const handleClientMessage = async ({ api, config, store, message }) => {
  const text = message.text || "";

  if (text.startsWith("/start")) {
    const [, payload = ""] = text.split(/\s+/, 2);
    if (payload.startsWith("bind_")) {
      await handleBindPayload({ api, config, store, message, token: payload.slice("bind_".length) });
      return;
    }

    const serviceKey = normalizePayload(payload);

    if (serviceKey && store.hasConsent(message.chat.id)) {
      await startRequest({ api, config, store, message, serviceKey });
      return;
    }

    await showWelcome({ api, config, message });
    return;
  }

  if (!store.hasConsent(message.chat.id)) {
    await showWelcome({ api, config, message });
    return;
  }

  if (text === "/help" || text === "Связаться с командой") {
    await requestContact({ api, store, chatId: message.chat.id });
    return;
  }

  if (text === "/services" || text === "Финансовый разбор") {
    await sendFinancialReview({ api, config, chatId: message.chat.id });
    return;
  }

  if (text === "Диагностика кредитной истории") {
    await sendCreditHistory({ api, config, chatId: message.chat.id });
    return;
  }

  if (text === "/documents" || text === "Отправить документы") {
    await requestDocuments({ api, store, chatId: message.chat.id });
    return;
  }

  if (text === "/status" || text === "Статус заявки") {
    await sendStatus({ api, store, chatId: message.chat.id });
    return;
  }

  if (text === "Назад в главное меню" || text === "Отменить обращение") {
    userModes.delete(String(message.chat.id));
    await showMainMenu({ api, chatId: message.chat.id });
    return;
  }

  const serviceKey = serviceKeyFromText(text);
  if (serviceKey) {
    await startRequest({ api, config, store, message, serviceKey });
    return;
  }

  const mode = userModes.get(String(message.chat.id));
  const activeRequests = store.getRequestsByChatId(message.chat.id).filter((item) => item.status !== "closed");
  const request = mode?.requestId ? store.getRequest(mode.requestId) : store.getActiveRequest(message.chat.id);

  if (mode?.type === "contact" && text) {
    await api.sendMessage({
      chatId: config.adminChatId,
      text: [
        "ОБРАЩЕНИЕ К КОМАНДЕ",
        `Имя: ${getClient(message).name || "-"}`,
        `Telegram: @${getClient(message).username || "-"}`,
        `Telegram ID: ${message.chat.id}`,
        mode.requestId ? `Номер заявки: ${mode.requestId}` : "",
        mode.requestId ? `Услуга: ${SERVICES[store.getRequest(mode.requestId)?.serviceKey]?.adminTitle || "-"}` : "",
        `Текст вопроса: ${text}`,
        `Дата: ${new Date().toISOString()}`,
      ].filter(Boolean).join("\n"),
      replyMarkup: mode.requestId ? buildAdminStatusKeyboard(mode.requestId) : undefined,
    });
    await api.sendMessage({ chatId: message.chat.id, text: "Ваш вопрос передан команде Даниса.", replyMarkup: buildMainMenuKeyboard() });
    userModes.delete(String(message.chat.id));
    return;
  }

  if (!request) {
    await api.sendMessage({
      chatId: message.chat.id,
      text: clientHelp,
      replyMarkup: buildMainMenuKeyboard(),
    });
    return;
  }

  if (!mode && activeRequests.length > 1) {
    await api.sendMessage({
      chatId: message.chat.id,
      text: [
        "У вас несколько активных заявок.",
        "Чтобы не смешать переписку, выберите нужную заявку через «Статус заявки» или напишите команде, указав номер заявки.",
      ].join("\n"),
      replyMarkup: buildMainMenuKeyboard(),
    });
    return;
  }

  const attachment = describeAttachment(message);
  if (attachment) {
    if (!isAllowedAttachment(attachment)) {
      await api.sendMessage({
        chatId: message.chat.id,
        text: "Не удалось принять файл. Отправьте документ в формате PDF, JPG или PNG.",
      });
      return;
    }
    await store.addAttachment(request.id, {
      ...attachment,
      caption: message.caption || "",
      telegramMessageId: message.message_id,
    });
    const adminFileMessage = await api.copyMessage({
      chatId: config.adminChatId,
      fromChatId: message.chat.id,
      messageId: message.message_id,
      caption: `Файл по заявке ${request.id}`,
    });
    await store.mapAdminMessage(adminFileMessage?.message_id, request.id);
    await api.sendMessage({
      chatId: message.chat.id,
      text: "Документ получен и прикреплён к вашей заявке.",
    });
    return;
  }

  if (text || message.caption) {
    const clientText = text || message.caption;
    await store.addClientMessage(request.id, {
      text: clientText,
      telegramMessageId: message.message_id,
    });
    const adminClientMessage = await api.sendMessage({
      chatId: config.adminChatId,
      text: [`Новое сообщение по заявке ${request.id}:`, "", clientText].join("\n"),
    });
    await store.mapAdminMessage(adminClientMessage?.message_id, request.id);
    await api.sendMessage({
      chatId: message.chat.id,
      text: `Сообщение принято и добавлено к заявке ${request.id}.`,
    });
  }
};

const handleUpdate = async ({ api, config, store, update }) => {
  await store.load();

  if (update.callback_query) {
    await handleCallbackQuery({ api, config, store, callbackQuery: update.callback_query });
    return;
  }

  const message = update.message;
  if (!message?.chat) return;

  if (String(message.chat.id) === String(config.adminChatId)) {
    await handleAdminMessage({ api, config, store, message });
    return;
  }

  await handleClientMessage({ api, config, store, message });
};

export const createBotRuntime = ({ api, config, store }) => ({
  handleUpdate: (update) => handleUpdate({ api, config, store, update }),
});

const main = async () => {
  await loadDotEnv();
  const config = getConfig();
  const api = new TelegramApi(config.token);
  const store = new RequestStore(resolve(rootDir, config.dataDir));
  await store.load();
  await api.setMyCommands([
    { command: "start", description: "Открыть главное меню" },
    { command: "services", description: "Посмотреть услуги" },
    { command: "documents", description: "Отправить документы" },
    { command: "status", description: "Проверить статус заявки" },
    { command: "help", description: "Связаться с командой" },
  ]);

  let offset = 0;
  console.log("Client Telegram bot started");

  while (true) {
    try {
      const updates = await api.getUpdates({
        offset,
        timeout: config.pollTimeoutSeconds,
        allowed_updates: ["message", "callback_query"],
      });

      for (const update of updates) {
        offset = update.update_id + 1;
        await handleUpdate({ api, config, store, update });
      }
    } catch (error) {
      console.error(error);
      await sleep(config.pollRetryDelayMs);
    }
  }
};

if (process.env.BOT_DISABLE_AUTOSTART !== "1") {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
