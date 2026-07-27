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

  sendMessage({ chatId, text, replyMarkup }) {
    return this.call("sendMessage", {
      chat_id: chatId,
      text,
      disable_web_page_preview: true,
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

  getChatMember({ chatId, userId }) {
    return this.call("getChatMember", {
      chat_id: chatId,
      user_id: userId,
    });
  }

  deleteWebhook() {
    return this.call("deleteWebhook", { drop_pending_updates: false });
  }
}
