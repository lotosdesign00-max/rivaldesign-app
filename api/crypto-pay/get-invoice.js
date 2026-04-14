const { sendJson, readJsonBody, cryptoPayRequest, ensureToken } = require("../_lib/crypto-pay");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    sendJson(res, 405, { ok: false, error: "Method not allowed" });
    return;
  }

  const token = ensureToken(res);
  if (!token) return;

  try {
    const body = await readJsonBody(req);
    const invoiceId = Number(body.invoiceId || body.invoice_id || 0);
    if (!invoiceId) {
      sendJson(res, 400, { ok: false, error: "Missing invoiceId" });
      return;
    }

    const result = await cryptoPayRequest(token, "getInvoices", { invoice_ids: [invoiceId] });
    const invoice = Array.isArray(result?.items) ? result.items[0] : null;
    sendJson(res, 200, { ok: true, result: invoice || null });
  } catch (error) {
    sendJson(res, 500, { ok: false, error: error instanceof Error ? error.message : "Unknown error" });
  }
};
