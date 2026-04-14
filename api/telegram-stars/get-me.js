const { sendJson, telegramBotRequest, ensureBotToken } = require("../_lib/telegram-stars");

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    sendJson(res, 405, { ok: false, error: "Method not allowed" });
    return;
  }

  const token = ensureBotToken(res);
  if (!token) return;

  try {
    const result = await telegramBotRequest(token, "getMe");
    sendJson(res, 200, { ok: true, result });
  } catch (error) {
    sendJson(res, 500, { ok: false, error: error instanceof Error ? error.message : "Unknown error" });
  }
};
