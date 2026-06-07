import http from "node:http";

const PORT = Number(process.env.PORT || 3100);
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const MAX_BODY_BYTES = 32 * 1024;

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

const sendTelegramMessage = async (text) => {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    throw new Error("Telegram credentials are not configured");
  }

  const response = await fetch(
    `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        chat_id: TELEGRAM_CHAT_ID,
        text,
      }).toString(),
    },
  );

  if (!response.ok) {
    throw new Error(`Telegram API responded with ${response.status}`);
  }
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
