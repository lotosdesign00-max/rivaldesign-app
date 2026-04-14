const { sendJson, readJsonBody, telegramBotRequest, ensureBotToken, ensureWebhook } = require("../_lib/telegram-stars");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    sendJson(res, 405, { ok: false, error: "Method not allowed" });
    return;
  }

  const token = ensureBotToken(res);
  if (!token) return;

  try {
    await ensureWebhook(token, req);
    const body = await readJsonBody(req);
    const amountStars = Math.max(1, Number(body.amountStars || 0));
    if (!Number.isFinite(amountStars) || amountStars <= 0) {
      sendJson(res, 400, { ok: false, error: "Invalid amountStars" });
      return;
    }

    const title = String(body.title || "Rival Space").slice(0, 32);
    const description = String(body.description || "Telegram Stars payment").slice(0, 255);
    const payload = String(body.payload || "rival-stars").slice(0, 128);
    const invoiceLink = await telegramBotRequest(token, "createInvoiceLink", {
      title,
      description,
      payload,
      provider_token: "",
      currency: "XTR",
      prices: [{ label: title, amount: amountStars }],
    });

    sendJson(res, 200, {
      ok: true,
      result: {
        invoiceLink,
        amountStars,
        slug: String(invoiceLink || "").split("/").pop() || "",
      },
    });
  } catch (error) {
    sendJson(res, 500, { ok: false, error: error instanceof Error ? error.message : "Unknown error" });
  }
};
