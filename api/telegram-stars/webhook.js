const { sendJson, readJsonBody, telegramBotRequest, ensureBotToken } = require("../_lib/telegram-stars");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    sendJson(res, 405, { ok: false, error: "Method not allowed" });
    return;
  }

  const token = ensureBotToken(res);
  if (!token) return;

  try {
    const update = await readJsonBody(req);

    if (update?.pre_checkout_query?.id) {
      await telegramBotRequest(token, "answerPreCheckoutQuery", {
        pre_checkout_query_id: update.pre_checkout_query.id,
        ok: true,
      });
    }

    sendJson(res, 200, { ok: true });
  } catch (error) {
    sendJson(res, 500, { ok: false, error: error instanceof Error ? error.message : "Unknown error" });
  }
};
