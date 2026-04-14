function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  if (typeof res.setHeader === "function") {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
  }
  res.end(JSON.stringify(payload));
}

async function readJsonBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      if (!data) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(data));
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

function getCryptoToken() {
  return process.env.CRYPTOPAY_API_TOKEN || process.env.CRYPTO_PAY_API_TOKEN || "";
}

function getDefaultAsset() {
  return process.env.CRYPTOPAY_ASSET || "USDT";
}

async function cryptoPayRequest(token, method, body) {
  const response = await fetch(`https://pay.crypt.bot/api/${method}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Crypto-Pay-API-Token": token,
    },
    body: JSON.stringify(body || {}),
  });

  const json = await response.json().catch(() => null);
  if (!response.ok || !json?.ok) {
    const message = json?.error?.name || json?.error || `Crypto Pay request failed: ${response.status}`;
    throw new Error(message);
  }
  return json.result;
}

function ensureToken(res) {
  const token = getCryptoToken();
  if (!token) {
    sendJson(res, 500, { ok: false, error: "Missing CRYPTOPAY_API_TOKEN in server env" });
    return null;
  }
  return token;
}

module.exports = {
  sendJson,
  readJsonBody,
  getDefaultAsset,
  cryptoPayRequest,
  ensureToken,
};
