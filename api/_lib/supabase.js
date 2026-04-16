const crypto = require("crypto");

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

function getSupabaseConfig() {
  return {
    url: process.env.SUPABASE_URL || "",
    key: process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SECRET_KEY || "",
  };
}

function ensureSupabase(res) {
  const config = getSupabaseConfig();
  if (!config.url || !config.key) {
    sendJson(res, 500, { ok: false, error: "Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in server env" });
    return null;
  }
  return config;
}

function normalizeSupabaseUrl(url) {
  return String(url || "").replace(/\/+$/, "");
}

async function supabaseRest(path, { method = "GET", body, prefer = "return=representation", signal } = {}) {
  const config = getSupabaseConfig();
  if (!config.url || !config.key) throw new Error("Supabase env is not configured");

  const response = await fetch(`${normalizeSupabaseUrl(config.url)}/rest/v1/${path}`, {
    method,
    signal,
    headers: {
      apikey: config.key,
      Authorization: `Bearer ${config.key}`,
      "Content-Type": "application/json",
      Prefer: prefer,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const text = await response.text();
  const json = text ? JSON.parse(text) : null;
  if (!response.ok) {
    throw new Error(json?.message || json?.hint || `Supabase request failed: ${response.status}`);
  }
  return json;
}

function timingSafeEqualHex(a, b) {
  if (!a || !b || a.length !== b.length) return false;
  try {
    return crypto.timingSafeEqual(Buffer.from(a, "hex"), Buffer.from(b, "hex"));
  } catch {
    return false;
  }
}

function verifyTelegramInitData(initData) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN || process.env.BOT_TOKEN || process.env.TELEGRAM_MINIAPP_BOT_TOKEN || "";
  if (!initData || !botToken) return null;

  const params = new URLSearchParams(initData);
  const hash = params.get("hash");
  if (!hash) return null;
  params.delete("hash");

  const dataCheckString = Array.from(params.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  const secret = crypto.createHmac("sha256", "WebAppData").update(botToken).digest();
  const calculatedHash = crypto.createHmac("sha256", secret).update(dataCheckString).digest("hex");
  if (!timingSafeEqualHex(calculatedHash, hash)) {
    throw new Error("Invalid Telegram init data");
  }

  const userRaw = params.get("user");
  return userRaw ? JSON.parse(userRaw) : null;
}

function getTelegramUser(body) {
  const verifiedUser = verifyTelegramInitData(body.telegramInitData || "");
  const fallbackUser = body.telegramUser || null;
  const user = verifiedUser || fallbackUser;
  if (!user?.id) throw new Error("Missing Telegram user id");
  return {
    id: Number(user.id),
    username: user.username || null,
    first_name: user.first_name || null,
    last_name: user.last_name || null,
    photo_url: user.photo_url || null,
  };
}

async function ensureUser(telegramUser) {
  const payload = {
    telegram_id: telegramUser.id,
    username: telegramUser.username,
    first_name: telegramUser.first_name,
    last_name: telegramUser.last_name,
    photo_url: telegramUser.photo_url,
    updated_at: new Date().toISOString(),
  };

  let rows;
  try {
    rows = await supabaseRest("users?on_conflict=telegram_id", {
      method: "POST",
      body: payload,
      prefer: "resolution=merge-duplicates,return=representation",
    });
  } catch (error) {
    if (!String(error?.message || "").toLowerCase().includes("photo_url")) {
      throw error;
    }
    const { photo_url, ...legacyPayload } = payload;
    rows = await supabaseRest("users?on_conflict=telegram_id", {
      method: "POST",
      body: legacyPayload,
      prefer: "resolution=merge-duplicates,return=representation",
    });
  }
  return Array.isArray(rows) ? rows[0] : rows;
}

function money(value) {
  const number = Number(value || 0);
  return Number.isFinite(number) ? Math.round(number * 100) / 100 : 0;
}

function orderByCreatedDesc(rows) {
  return Array.isArray(rows)
    ? rows.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
    : [];
}

module.exports = {
  sendJson,
  readJsonBody,
  ensureSupabase,
  supabaseRest,
  getTelegramUser,
  ensureUser,
  money,
  orderByCreatedDesc,
};
