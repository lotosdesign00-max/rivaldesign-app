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

function getTelegramBotToken() {
  return process.env.TELEGRAM_BOT_TOKEN || process.env.BOT_TOKEN || process.env.TELEGRAM_MINIAPP_BOT_TOKEN || "";
}

async function telegramBotRequest(token, method, body) {
  const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body || {}),
  });

  const json = await response.json().catch(() => null);
  if (!response.ok || !json?.ok) {
    throw new Error(json?.description || `Telegram Bot API request failed: ${response.status}`);
  }
  return json.result;
}

function ensureBotToken(res) {
  const token = getTelegramBotToken();
  if (!token) {
    sendJson(res, 500, { ok: false, error: "Missing TELEGRAM_BOT_TOKEN in server env" });
    return null;
  }
  return token;
}

function getPublicBaseUrl(req) {
  const headers = req.headers || {};
  const host = headers["x-forwarded-host"] || headers.host || "";
  const proto = headers["x-forwarded-proto"] || (String(host).includes("localhost") ? "http" : "https");
  return host ? `${proto}://${host}` : "";
}

async function ensureWebhook(token, req) {
  const baseUrl = getPublicBaseUrl(req);
  if (!baseUrl || baseUrl.includes("localhost") || baseUrl.includes("127.0.0.1")) return null;
  const webhookUrl = `${baseUrl}/api/telegram-stars/webhook`;
  await telegramBotRequest(token, "setWebhook", {
    url: webhookUrl,
    allowed_updates: ["pre_checkout_query", "message"],
    drop_pending_updates: false,
  });
  return webhookUrl;
}

module.exports = {
  sendJson,
  readJsonBody,
  telegramBotRequest,
  ensureBotToken,
  ensureWebhook,
};
