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
const ALLOWED_MIME_TYPES = new Set(["application/pdf", "image/jpeg", "image/png"]);
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

const notifyAdminAboutRequest = async ({ api, config, request }) => {
  await api.sendMessage({
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
  await notifyAdminAboutRequest({ api, config, request });

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

  return null;
};

const isAllowedAttachment = (attachment) => {
  if (!attachment) return false;
  const fileName = attachment.fileName.toLowerCase();
  const hasAllowedExtension = attachment.type === "photo" || ALLOWED_EXTENSIONS.some((extension) => fileName.endsWith(extension));
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

  await api.sendMessage({ chatId: config.adminChatId, text: statusLine });
  if (updated.client?.chatId) {
    await api.sendMessage({
      chatId: updated.client.chatId,
      text: `Статус вашей заявки ${updated.id}: ${STATUS_LABELS[updated.status] || updated.status}.`,
    });
  }
};

const handleAdminMessage = async ({ api, config, store, message }) => {
  const text = message.text || "";

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
    await api.sendMessage({ chatId: config.adminChatId, text: `Сообщение отправлено клиенту по заявке ${request.id}.` });
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

  const request = store.getActiveRequest(message.chat.id);
  const mode = userModes.get(String(message.chat.id));

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
    await api.copyMessage({
      chatId: config.adminChatId,
      fromChatId: message.chat.id,
      messageId: message.message_id,
      caption: `Файл по заявке ${request.id}`,
    });
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
    await api.sendMessage({
      chatId: config.adminChatId,
      text: [`Новое сообщение по заявке ${request.id}:`, "", clientText].join("\n"),
    });
    await api.sendMessage({
      chatId: message.chat.id,
      text: `Сообщение принято и добавлено к заявке ${request.id}.`,
    });
  }
};

const handleUpdate = async ({ api, config, store, update }) => {
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
