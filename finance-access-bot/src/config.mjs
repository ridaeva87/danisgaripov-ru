export const getConfig = () => {
  const token = process.env.FINANCE_ACCESS_BOT_TOKEN;

  if (!token) {
    throw new Error("FINANCE_ACCESS_BOT_TOKEN is required");
  }

  return {
    token,
    channelUsername: process.env.FINANCE_ACCESS_CHANNEL_USERNAME || "@garipovdanis",
    accessCode: process.env.FINANCE_ACCESS_CODE || "ФИНРАЗБОР",
    pollTimeoutSeconds: Number(process.env.POLL_TIMEOUT_SECONDS || 25),
    pollRetryDelayMs: Number(process.env.POLL_RETRY_DELAY_MS || 1500),
  };
};
