const { sendJson, readJsonBody, getDefaultAsset, cryptoPayRequest, ensureToken } = require("../_lib/crypto-pay");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    sendJson(res, 405, { ok: false, error: "Method not allowed" });
    return;
  }

  const token = ensureToken(res);
  if (!token) return;

  try {
    const body = await readJsonBody(req);
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
  } catch (error) {
    sendJson(res, 500, { ok: false, error: error instanceof Error ? error.message : "Unknown error" });
  }
};
