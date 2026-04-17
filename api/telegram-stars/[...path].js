const { sendJson, readJsonBody, telegramBotRequest, ensureBotToken, ensureWebhook } = require("../_lib/telegram-stars");

function getAction(req) {
  const path = Array.isArray(req.query.path) ? req.query.path : [req.query.path].filter(Boolean);
  return path[0] || "";
}

module.exports = async (req, res) => {
  const action = getAction(req);
  const token = ensureBotToken(res);
  if (!token) return;

  try {
    if (action === "get-me") {
      if (req.method !== "GET") {
        sendJson(res, 405, { ok: false, error: "Method not allowed" });
        return;
      }

      const result = await telegramBotRequest(token, "getMe");
      sendJson(res, 200, { ok: true, result });
      return;
    }

    if (req.method !== "POST") {
      sendJson(res, 405, { ok: false, error: "Method not allowed" });
      return;
    }

    if (action === "create-invoice") {
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
      return;
    }

    if (action === "webhook") {
      const update = await readJsonBody(req);

      if (update?.pre_checkout_query?.id) {
        await telegramBotRequest(token, "answerPreCheckoutQuery", {
          pre_checkout_query_id: update.pre_checkout_query.id,
          ok: true,
        });
      }

      sendJson(res, 200, { ok: true });
      return;
    }

    sendJson(res, 404, { ok: false, error: "Unknown Telegram Stars endpoint" });
  } catch (error) {
    sendJson(res, 500, { ok: false, error: error instanceof Error ? error.message : "Unknown error" });
  }
};
