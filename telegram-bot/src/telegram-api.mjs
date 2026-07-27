export class TelegramApi {
  constructor(token) {
    this.baseUrl = `https://api.telegram.org/bot${token}`;
  }

  async call(method, payload = {}) {
    const response = await fetch(`${this.baseUrl}/${method}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    const body = await response.json().catch(() => ({}));

    if (!response.ok || body.ok === false) {
      const description = body.description || response.statusText;
      throw new Error(`Telegram API ${method} failed: ${description}`);
    }

    return body.result;
  }

  getUpdates(payload) {
    return this.call("getUpdates", payload);
  }

  sendMessage({ chatId, text, replyMarkup, parseMode }) {
    return this.call("sendMessage", {
      chat_id: chatId,
      text,
      parse_mode: parseMode,
      disable_web_page_preview: true,
      ...(replyMarkup ? { reply_markup: replyMarkup } : {}),
    });
  }

  copyMessage({ chatId, fromChatId, messageId, caption }) {
    return this.call("copyMessage", {
      chat_id: chatId,
      from_chat_id: fromChatId,
      message_id: messageId,
      ...(caption ? { caption } : {}),
    });
  }

  sendPhoto({ chatId, photo, caption, replyMarkup }) {
    return this.call("sendPhoto", {
      chat_id: chatId,
      photo,
      caption,
      ...(replyMarkup ? { reply_markup: replyMarkup } : {}),
    });
  }

  answerCallbackQuery({ callbackQueryId, text, showAlert = false }) {
    return this.call("answerCallbackQuery", {
      callback_query_id: callbackQueryId,
      text,
      show_alert: showAlert,
    });
  }

  editMessageReplyMarkup({ chatId, messageId, replyMarkup }) {
    return this.call("editMessageReplyMarkup", {
      chat_id: chatId,
      message_id: messageId,
      reply_markup: replyMarkup,
    });
  }

  setMyCommands(commands) {
    return this.call("setMyCommands", { commands });
  }
}
