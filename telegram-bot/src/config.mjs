export const getConfig = () => {
  const token = process.env.CLIENT_BOT_TOKEN;
  const adminChatId = process.env.ADMIN_CHAT_ID;

  if (!token) {
    throw new Error("CLIENT_BOT_TOKEN is required");
  }

  if (!adminChatId) {
    throw new Error("ADMIN_CHAT_ID is required");
  }

  return {
    token,
    adminChatId,
    publicSiteUrl: process.env.PUBLIC_SITE_URL || "https://danisgaripov.ru",
    dataDir: process.env.DATA_DIR || "./data",
    pollTimeoutSeconds: Number(process.env.POLL_TIMEOUT_SECONDS || 25),
    pollRetryDelayMs: Number(process.env.POLL_RETRY_DELAY_MS || 1500),
  };
};
