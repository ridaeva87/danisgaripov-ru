import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { getConfig } from "./config.mjs";
import { TelegramApi } from "./telegram-api.mjs";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SUBSCRIBED_STATUSES = new Set(["creator", "administrator", "member"]);

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

const channelUrl = (channelUsername) => `https://t.me/${channelUsername.replace(/^@/, "")}`;

const buildStartKeyboard = (channelUsername) => ({
  inline_keyboard: [
    [{ text: "Подписаться на канал", url: channelUrl(channelUsername) }],
    [{ text: "Проверить подписку", callback_data: "subscription:check" }],
  ],
});

const startText = (channelUsername) => [
  "Здравствуйте! Чтобы получить бесплатный финансовый разбор, подпишитесь на Telegram-канал Даниса.",
  "",
  `Канал: ${channelUsername}`,
  "",
  "После подписки нажмите «Проверить подписку».",
].join("\n");

const successText = (accessCode) => [
  "Подписка подтверждена.",
  "",
  "Ваш код доступа к опросу:",
  accessCode,
  "",
  "Вернитесь на страницу финансового разбора и введите этот код.",
].join("\n");

const checkSubscription = async ({ api, config, userId }) => {
  const member = await api.getChatMember({
    chatId: config.channelUsername,
    userId,
  });
  return SUBSCRIBED_STATUSES.has(member.status);
};

const handleMessage = async ({ api, config, message }) => {
  const text = message.text || "";
  if (!text.startsWith("/start")) {
    await api.sendMessage({
      chatId: message.chat.id,
      text: startText(config.channelUsername),
      replyMarkup: buildStartKeyboard(config.channelUsername),
    });
    return;
  }

  await api.sendMessage({
    chatId: message.chat.id,
    text: startText(config.channelUsername),
    replyMarkup: buildStartKeyboard(config.channelUsername),
  });
};

const handleCallbackQuery = async ({ api, config, callbackQuery }) => {
  if (callbackQuery.data !== "subscription:check") return;

  try {
    const subscribed = await checkSubscription({
      api,
      config,
      userId: callbackQuery.from.id,
    });

    if (subscribed) {
      await api.answerCallbackQuery({ callbackQueryId: callbackQuery.id, text: "Подписка подтверждена" });
      await api.sendMessage({
        chatId: callbackQuery.from.id,
        text: successText(config.accessCode),
      });
      return;
    }

    await api.answerCallbackQuery({
      callbackQueryId: callbackQuery.id,
      text: "Подписка пока не найдена",
      showAlert: true,
    });
    await api.sendMessage({
      chatId: callbackQuery.from.id,
      text: "Подписка пока не найдена. Подпишитесь на канал и нажмите «Проверить подписку» ещё раз.",
      replyMarkup: buildStartKeyboard(config.channelUsername),
    });
  } catch (error) {
    console.error("Subscription check failed", error.message);
    await api.answerCallbackQuery({
      callbackQueryId: callbackQuery.id,
      text: "Не удалось проверить подписку",
      showAlert: true,
    });
    await api.sendMessage({
      chatId: callbackQuery.from.id,
      text: "Не удалось проверить подписку. Проверьте, что бот добавлен в администраторы канала, и попробуйте ещё раз.",
    });
  }
};

const handleUpdate = async ({ api, config, update }) => {
  if (update.callback_query) {
    await handleCallbackQuery({ api, config, callbackQuery: update.callback_query });
    return;
  }

  if (update.message?.chat) {
    await handleMessage({ api, config, message: update.message });
  }
};

const main = async () => {
  await loadDotEnv();
  const config = getConfig();
  const api = new TelegramApi(config.token);
  await api.deleteWebhook();

  let offset = 0;
  console.log("Finance access bot started");

  while (true) {
    try {
      const updates = await api.getUpdates({
        offset,
        timeout: config.pollTimeoutSeconds,
        allowed_updates: ["message", "callback_query"],
      });

      for (const update of updates) {
        offset = update.update_id + 1;
        await handleUpdate({ api, config, update });
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
