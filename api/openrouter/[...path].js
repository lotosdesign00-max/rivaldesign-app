function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
}

async function readRawBody(req) {
  if (Buffer.isBuffer(req.body)) return req.body;
  if (typeof req.body === "string") return Buffer.from(req.body);
  if (req.body && typeof req.body === "object") return Buffer.from(JSON.stringify(req.body));

  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

function getTargetUrl(req) {
  const pathParts = Array.isArray(req.query.path) ? req.query.path : [req.query.path].filter(Boolean);
  const path = pathParts.map((part) => encodeURIComponent(part)).join("/") || "chat/completions";
  return `https://openrouter.ai/api/v1/${path}`;
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    sendJson(res, 405, { ok: false, error: "Method not allowed" });
    return;
  }

  const token = process.env.OPENROUTER_API_KEY || process.env.VITE_OPENROUTER_API_KEY || "";
  if (!token) {
    sendJson(res, 500, { ok: false, error: "Missing OPENROUTER_API_KEY in server env" });
    return;
  }

  try {
    const body = await readRawBody(req);
    const response = await fetch(getTargetUrl(req), {
      method: "POST",
      headers: {
        "Content-Type": req.headers["content-type"] || "application/json",
        Authorization: `Bearer ${token}`,
        "HTTP-Referer": req.headers["x-rival-referer"] || req.headers.referer || "https://rivaldesign.app",
        "X-Title": req.headers["x-rival-title"] || "RivalDesign AI Chat",
      },
      body,
    });

    const responseBody = Buffer.from(await response.arrayBuffer());
    res.statusCode = response.status;
    res.setHeader("Content-Type", response.headers.get("content-type") || "application/json; charset=utf-8");
    res.end(responseBody);
  } catch (error) {
    sendJson(res, 500, { ok: false, error: error instanceof Error ? error.message : "Unknown OpenRouter proxy error" });
  }
};
