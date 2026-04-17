const { sendJson, readJsonBody, getDefaultAsset, cryptoPayRequest, ensureToken } = require("../_lib/crypto-pay");

function getAction(req) {
  const path = Array.isArray(req.query.path) ? req.query.path : [req.query.path].filter(Boolean);
  return path[0] || "";
}

module.exports = async (req, res) => {
  const action = getAction(req);
  const token = ensureToken(res);
  if (!token) return;

  try {
    if (action === "get-me") {
      if (req.method !== "GET") {
        sendJson(res, 405, { ok: false, error: "Method not allowed" });
        return;
      }

      const result = await cryptoPayRequest(token, "getMe");
      sendJson(res, 200, { ok: true, result });
      return;
    }

    if (req.method !== "POST") {
      sendJson(res, 405, { ok: false, error: "Method not allowed" });
      return;
    }

    const body = await readJsonBody(req);

    if (action === "create-invoice") {
      const amount = Number(body.amount || body.amountUSD || 0);
      if (!amount || amount <= 0) {
        sendJson(res, 400, { ok: false, error: "Invalid amount" });
        return;
      }

      const payload = {
        asset: body.asset || getDefaultAsset(),
        amount: amount.toFixed(2),
        description: body.description || "Rival Design payment",
        hidden_message: body.hiddenMessage || "Rival Design payment draft",
        payload: body.payload || "",
        allow_comments: false,
        allow_anonymous: false,
      };

      if (body.paid_btn_name) payload.paid_btn_name = body.paid_btn_name;
      if (body.paid_btn_url) payload.paid_btn_url = body.paid_btn_url;
      if (body.expires_in) payload.expires_in = body.expires_in;

      const result = await cryptoPayRequest(token, "createInvoice", payload);
      sendJson(res, 200, { ok: true, result });
      return;
    }

    if (action === "get-invoice") {
      const invoiceId = Number(body.invoiceId || body.invoice_id || 0);
      if (!invoiceId) {
        sendJson(res, 400, { ok: false, error: "Missing invoiceId" });
        return;
      }

      const result = await cryptoPayRequest(token, "getInvoices", { invoice_ids: [invoiceId] });
      const invoice = Array.isArray(result?.items) ? result.items[0] : null;
      sendJson(res, 200, { ok: true, result: invoice || null });
      return;
    }

    sendJson(res, 404, { ok: false, error: "Unknown Crypto Pay endpoint" });
  } catch (error) {
    sendJson(res, 500, { ok: false, error: error instanceof Error ? error.message : "Unknown error" });
  }
};
