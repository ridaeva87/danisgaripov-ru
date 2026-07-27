import test from "node:test";
import assert from "node:assert/strict";

import {
  formatClientStartMessage,
  formatRequestSummary,
  formatSiteRequestMessage,
  normalizePayload,
  serviceKeyFromText,
} from "../src/messages.mjs";

test("normalizes supported deep-link payloads", () => {
  assert.equal(normalizePayload("credit-history"), "credit_history");
  assert.equal(normalizePayload("financial_comfort"), "financial_comfort");
  assert.equal(normalizePayload("unknown"), "");
});

test("resolves service by visible title", () => {
  assert.equal(serviceKeyFromText("Диагностика кредитной истории"), "credit_history");
  assert.equal(serviceKeyFromText("Бизнес-психолог"), "business_psychologist");
});

test("formats admin request summary", () => {
  const summary = formatRequestSummary({
    id: "REQ-00001",
    serviceKey: "credit_history",
    status: "collecting",
    client: { chatId: 123, name: "Лилия", username: "lilia" },
    messages: [{ text: "Нужна диагностика" }],
    attachments: [{ type: "document" }],
    createdAt: "2026-07-27T10:00:00.000Z",
    updatedAt: "2026-07-27T10:01:00.000Z",
  });

  assert.match(summary, /REQ-00001/);
  assert.match(summary, /Диагностика кредитной истории/);
  assert.match(summary, /Заявка получена/);
  assert.match(summary, /Файлов\/скриншотов: 1/);
});

test("credit history start message includes required client instructions", () => {
  const message = formatClientStartMessage("credit_history", "https://danisgaripov.ru");

  assert.match(message, /Госуслуги/);
  assert.match(message, /БКИ/);
  assert.match(message, /PDF-файл или скриншоты/);
  assert.match(message, /https:\/\/danisgaripov\.ru/);
});

test("formats site financial Light request without mini wording", () => {
  const message = formatSiteRequestMessage({
    id: "REQ-00002",
    serviceKey: "financial_light",
    packageName: "Light",
    source: "danisgaripov.ru",
    client: { name: "Лилия", phone: "+79990000000", telegram: "@lilia" },
    answers: [{ question: "Что актуально?", answer: "Финансовый разбор" }],
    payment: {},
    createdAt: "2026-07-27T10:00:00.000Z",
  });

  assert.match(message, /НОВАЯ ЗАЯВКА/);
  assert.match(message, /Пакет: Light/);
  assert.match(message, /Номер заявки: REQ-00002/);
  assert.doesNotMatch(message.toLowerCase(), /мини-разбор/);
});
