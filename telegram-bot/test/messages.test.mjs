import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import {
  formatClientStartMessage,
  formatRequestSummary,
  formatSiteRequestMessage,
  normalizePayload,
  serviceKeyFromText,
} from "../src/messages.mjs";
import { RequestStore } from "../src/store.mjs";

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
    client: { name: "Лилия", phone: "+79990000000", email: "test@example.invalid", telegram: "@lilia" },
    max: "1-5 млн ₽",
    answers: [{ question: "Что актуально?", answer: "Финансовый разбор" }],
    payment: {},
    createdAt: "2026-07-27T10:00:00.000Z",
  });

  assert.match(message, /НОВАЯ ЗАЯВКА/);
  assert.match(message, /Пакет: Light/);
  assert.match(message, /Email: test@example\.invalid/);
  assert.match(message, /Сумма\/MAX: 1-5 млн ₽/);
  assert.match(message, /Номер заявки: REQ-00002/);
  assert.doesNotMatch(message.toLowerCase(), /мини-разбор/);
});

test("site request store keeps one request id for repeated request key", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "danis-requests-"));
  const store = new RequestStore(dir);
  await store.load();

  const first = await store.createRequestFromSite({
    serviceKey: "kreditovanie",
    client: {
      name: "Тест",
      phone: "+70000000000",
      email: "test@example.invalid",
      telegram: "@test",
    },
    max: "500000",
    answers: [{ question: "Комментарий", answer: "Тестовая заявка" }],
    requestKey: "site:test-key",
  });
  const second = await store.createRequestFromSite({
    serviceKey: "kreditovanie",
    client: {
      name: "Тест",
      phone: "+70000000000",
      email: "test@example.invalid",
      telegram: "@test",
    },
    max: "500000",
    answers: [{ question: "Комментарий", answer: "Тестовая заявка" }],
    requestKey: "site:test-key",
  });

  assert.equal(first.id, "REQ-00001");
  assert.equal(second.id, first.id);
  assert.equal(Object.keys(store.state.requests).length, 1);
  assert.equal(first.delivery.telegram.status, "pending");
  assert.equal(first.delivery.googleSheets.status, "pending");
});

test("binding token links site request to one Telegram chat once", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "danis-binding-"));
  const store = new RequestStore(dir);
  await store.load();

  const request = await store.createRequestFromSite({
    serviceKey: "it_razrabotka",
    client: { name: "Тест", telegram: "@test" },
    requestKey: "site:binding-test",
  });
  const binding = await store.createBindingToken(request.id);
  const result = await store.bindRequestToChat(binding.token, {
    chatId: 123456,
    name: "Telegram Client",
    username: "telegram_client",
  });
  const repeated = await store.bindRequestToChat(binding.token, {
    chatId: 987654,
    name: "Other Client",
    username: "other_client",
  });

  assert.equal(result.ok, true);
  assert.equal(result.request.client.chatId, 123456);
  assert.equal(result.request.client.username, "telegram_client");
  assert.equal(store.getActiveRequest(123456).id, request.id);
  assert.equal(repeated.ok, false);
  assert.equal(repeated.reason, "used");
});

test("admin message map resolves reply target request", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "danis-message-map-"));
  const store = new RequestStore(dir);
  await store.load();

  const request = await store.createRequestFromSite({
    serviceKey: "business_psychologist",
    client: { name: "Тест", chatId: 222 },
    requestKey: "site:message-map-test",
  });
  await store.mapAdminMessage(555, request.id);

  assert.equal(store.getRequestByAdminMessage(555).id, request.id);
  assert.equal(store.getRequestByAdminMessage(556), null);
});
