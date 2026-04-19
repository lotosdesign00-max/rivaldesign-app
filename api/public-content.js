function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
}

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    sendJson(res, 405, { ok: false, error: "Method not allowed" });
    return;
  }

  // Keep the request successful without overriding bundled app content.
  // Admin-managed content can be re-enabled here later with a clean data source.
  sendJson(res, 200, { ok: false, result: null });
};
