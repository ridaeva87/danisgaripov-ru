import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { getConfig } from "./config.mjs";
import {
  SERVICES,
  STATUS_LABELS,
  buildServiceKeyboard,
  formatClientStartMessage,
  formatRequestSummary,
  normalizePayload,
  serviceKeyFromText,
} from "./messages.mjs";
import { RequestStore } from "./store.mjs";
import { TelegramApi } from "./telegram-api.mjs";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");

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
  "/status REQ-00001 collecting|in_progress|waiting_client|ready|closed - изменить статус",
  "/reply REQ-00001 текст - отправить сообщение клиенту",
  "/result REQ-00001 текст - отправить результат клиенту",
  "/close REQ-00001 - закрыть заявку",
].join("\n");

const clientHelp = [
  "Выберите направление кнопкой ниже или отправьте сообщение с описанием задачи.",
  "К заявке можно прикреплять PDF-файлы, документы и скриншоты.",
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
    replyMarkup: { remove_keyboard: true },
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
    };
  }

  if (message.photo?.length) {
    const photo = message.photo.at(-1);
    return {
      type: "photo",
      fileId: photo.file_id,
      fileName: "photo",
      mimeType: "image/jpeg",
    };
  }

  return null;
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

    const updated = await store.setStatus(requestId, status);
    await store.addAdminNote(requestId, {
      type: "status",
      author: message.from?.username || String(message.from?.id || ""),
      text: status,
    });
    await api.sendMessage({
      chatId: updated.client.chatId,
      text: `Статус вашей заявки ${updated.id} изменён: ${STATUS_LABELS[status]}.`,
    });
    await api.sendMessage({
      chatId: config.adminChatId,
      text: `Статус заявки ${updated.id} изменён: ${STATUS_LABELS[status]}.`,
    });
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

    await api.sendMessage({ chatId: request.client.chatId, text: `${prefix}${rest}` });
    await api.sendMessage({ chatId: config.adminChatId, text: `Сообщение отправлено клиенту по заявке ${request.id}.` });
    return;
  }

  if (command === "/close") {
    const updated = await store.setStatus(requestId, "closed");
    await api.sendMessage({
      chatId: updated.client.chatId,
      text: `Заявка ${updated.id} закрыта. Спасибо за обращение.`,
    });
    await api.sendMessage({ chatId: config.adminChatId, text: `Заявка ${updated.id} закрыта.` });
    return;
  }

  await api.sendMessage({ chatId: config.adminChatId, text: adminHelp });
};

const handleClientMessage = async ({ api, config, store, message }) => {
  const text = message.text || "";

  if (text.startsWith("/start")) {
    const [, payload = ""] = text.split(/\s+/, 2);
    const serviceKey = normalizePayload(payload);

    if (serviceKey) {
      await startRequest({ api, config, store, message, serviceKey });
      return;
    }

    await api.sendMessage({
      chatId: message.chat.id,
      text: clientHelp,
      replyMarkup: buildServiceKeyboard(),
    });
    return;
  }

  if (text === "/help") {
    await api.sendMessage({
      chatId: message.chat.id,
      text: clientHelp,
      replyMarkup: buildServiceKeyboard(),
    });
    return;
  }

  const serviceKey = serviceKeyFromText(text);
  if (serviceKey) {
    await startRequest({ api, config, store, message, serviceKey });
    return;
  }

  const request = store.getActiveRequest(message.chat.id);
  if (!request) {
    await api.sendMessage({
      chatId: message.chat.id,
      text: "Чтобы команда Даниса увидела заявку, выберите направление.",
      replyMarkup: buildServiceKeyboard(),
    });
    return;
  }

  const attachment = describeAttachment(message);
  if (attachment) {
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
      text: `Файл принят и прикреплён к заявке ${request.id}.`,
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

  let offset = 0;
  console.log("Client Telegram bot started");

  while (true) {
    try {
      const updates = await api.getUpdates({
        offset,
        timeout: config.pollTimeoutSeconds,
        allowed_updates: ["message"],
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
