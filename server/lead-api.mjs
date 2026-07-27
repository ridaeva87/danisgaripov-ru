import http from "node:http";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { buildAdminStatusKeyboard, formatSiteRequestMessage, SERVICES } from "../telegram-bot/src/messages.mjs";
import { RequestStore } from "../telegram-bot/src/store.mjs";

const PORT = Number(process.env.PORT || 3100);
const MAX_BODY_BYTES = 32 * 1024;
const SHEETS_WEBHOOK_URL =
  "https://script.google.com/macros/s/AKfycbxb-6Z9chGABoxiOuwwopHJgl1FIpYoZ0ANhWaOLaSjCh8kBduWkYtPaipY47ttliWF/exec";
const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const loadBotEnv = async () => {
  const envPath = resolve(rootDir, "telegram-bot/.env");
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

await loadBotEnv();

const TELEGRAM_BOT_TOKEN = process.env.CLIENT_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.ADMIN_CHAT_ID || process.env.TELEGRAM_CHAT_ID;
const dataDir = process.env.DATA_DIR?.startsWith("/")
  ? process.env.DATA_DIR
  : resolve(rootDir, "telegram-bot", process.env.DATA_DIR || "data");
const store = new RequestStore(dataDir);
await store.load();

const sendJson = (res, status, data) => {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(JSON.stringify(data));
};

const readBody = (req) =>
  new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (Buffer.byteLength(body) > MAX_BODY_BYTES) {
        reject(new Error("Request body is too large"));
        req.destroy();
      }
    });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });

const sendTelegramMessage = async (text, replyMarkup) => {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    throw new Error("Telegram credentials are not configured");
  }

  const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text,
      disable_web_page_preview: true,
      ...(replyMarkup ? { reply_markup: replyMarkup } : {}),
    }),
  });

  if (!response.ok) {
    throw new Error(`Telegram API responded with ${response.status}`);
  }
};

const formatAnswersForSheets = (answers) => {
  if (!answers?.length) return "Ответы не переданы.";
  return answers.map((item, index) => `${index + 1}. ${item.question} - ${item.answer || "-"}`).join("\n");
};

const buildSheetsPayload = (request) => ({
  name: request.client?.name || "",
  phone: request.client?.phone || "",
  email: request.client?.email || "",
  telegram: request.client?.telegram || request.client?.username || "",
  max: request.max || "",
  service: [
    SERVICES[request.serviceKey]?.adminTitle || request.serviceKey,
    request.packageName ? `Пакет: ${request.packageName}` : "",
  ].filter(Boolean).join(" / "),
  comment: [
    `Номер заявки: ${request.id}`,
    `Дата: ${request.createdAt}`,
    `Источник: ${request.source || "danisgaripov.ru"}`,
    request.price ? `Стоимость: ${request.price}` : "",
    request.payment?.status ? `Статус оплаты: ${request.payment.status}` : "",
    request.payment?.id ? `ID платежа: ${request.payment.id}` : "",
    "",
    "Комментарий / ответы формы:",
    formatAnswersForSheets(request.answers),
  ].filter((line) => line !== "").join("\n"),
});

const sendGoogleSheetsLead = async (request) => {
  const response = await fetch(SHEETS_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(buildSheetsPayload(request)),
    redirect: "follow",
  });

  if (!response.ok) {
    throw new Error(`Google Apps Script responded with ${response.status}`);
  }

  const text = await response.text();
  try {
    const data = JSON.parse(text);
    if (data.status && data.status !== "success") {
      throw new Error(`Google Apps Script status: ${data.status}`);
    }
  } catch (error) {
    if (error instanceof SyntaxError) return;
    throw error;
  }
};

const normalizeAnswers = (answers) => {
  if (!Array.isArray(answers)) return [];
  return answers
    .map((item) => ({
      question: String(item?.question || "").slice(0, 500),
      answer: String(item?.answer || "").slice(0, 1000),
    }))
    .filter((item) => item.question || item.answer);
};

const buildRequestKey = (payload) => {
  const raw = [
    payload.serviceKey,
    payload.packageName,
    payload.client?.phone,
    payload.client?.telegram,
    JSON.stringify(payload.answers || []),
  ].join("|");
  return `site:${Buffer.from(raw).toString("base64url").slice(0, 120)}`;
};

const handleStructuredLead = async (payload) => {
  const request = await store.createRequestFromSite({
    serviceKey: String(payload.serviceKey || ""),
    packageName: String(payload.packageName || ""),
    price: String(payload.price || ""),
    payment: {
      status: String(payload.payment?.status || ""),
      id: String(payload.payment?.id || ""),
    },
    client: {
      chatId: payload.client?.chatId || "",
      name: String(payload.client?.name || "").slice(0, 200),
      phone: String(payload.client?.phone || "").slice(0, 100),
      email: String(payload.client?.email || "").slice(0, 200),
      telegram: String(payload.client?.telegram || "").slice(0, 100),
      username: String(payload.client?.telegram || "").replace(/^@/, "").slice(0, 100),
    },
    max: String(payload.max || "").slice(0, 100),
    answers: normalizeAnswers(payload.answers),
    source: "danisgaripov.ru",
    requestKey: payload.requestKey || buildRequestKey(payload),
  });

  const errors = [];
  if (request.delivery?.telegram?.status !== "success") {
    try {
      await sendTelegramMessage(formatSiteRequestMessage(request), buildAdminStatusKeyboard(request.id));
      await store.setDeliveryStatus(request.id, "telegram", "success");
    } catch (error) {
      await store.setDeliveryStatus(request.id, "telegram", "failed", error.message);
      errors.push(`telegram: ${error.message}`);
    }
  }

  if (request.delivery?.googleSheets?.status !== "success") {
    try {
      await sendGoogleSheetsLead(request);
      await store.setDeliveryStatus(request.id, "googleSheets", "success");
    } catch (error) {
      await store.setDeliveryStatus(request.id, "googleSheets", "failed", error.message);
      errors.push(`googleSheets: ${error.message}`);
    }
  }

  if (errors.length) {
    console.error(`Lead ${request.id} delivery errors: ${errors.join("; ")}`);
  }

  return request;
};

const server = http.createServer(async (req, res) => {
  if (req.method === "GET" && req.url === "/health") {
    sendJson(res, 200, { ok: true });
    return;
  }

  if (req.method !== "POST" || req.url !== "/api/lead") {
    sendJson(res, 404, { ok: false });
    return;
  }

  try {
    const rawBody = await readBody(req);
    const payload = JSON.parse(rawBody || "{}");

    if (payload.type === "site_request") {
      const request = await handleStructuredLead(payload);
      sendJson(res, 200, { ok: true, requestId: request.id });
      return;
    }

    const text = typeof payload.text === "string" ? payload.text.trim() : "";

    if (!text) {
      sendJson(res, 400, { ok: false, error: "Message text is required" });
      return;
    }

    await sendTelegramMessage(text);
    sendJson(res, 200, { ok: true });
  } catch (error) {
    console.error("Lead API error", error);
    sendJson(res, 500, { ok: false });
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Lead API listening on http://127.0.0.1:${PORT}`);
});
