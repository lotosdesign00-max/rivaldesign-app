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
    req.on("data", (chunk) => {
      chunks.push(Buffer.from(chunk));
    });
    req.on("end", () => {
      resolve(Buffer.concat(chunks));
    });
    req.on("error", reject);
  });
}

function getTargetUrl(req) {
  const pathParts = Array.isArray(req.query.path) ? req.query.path : [req.query.path].filter(Boolean);
  const query = new URLSearchParams();

  Object.entries(req.query || {}).forEach(([key, value]) => {
    if (key === "path") return;
    if (Array.isArray(value)) {
      value.forEach((item) => query.append(key, item));
      return;
    }
    if (value !== undefined) query.set(key, value);
  });

  const path = pathParts.map((part) => encodeURIComponent(part)).join("/");
  const suffix = query.toString() ? `?${query.toString()}` : "";
  return `https://api.cloudflare.com/client/v4/${path}${suffix}`;
}

module.exports = async (req, res) => {
  const token = process.env.CLOUDFLARE_API_TOKEN || process.env.VITE_CLOUDFLARE_API_TOKEN || "";
  if (!token) {
    sendJson(res, 500, { ok: false, error: "Missing CLOUDFLARE_API_TOKEN in server env" });
    return;
  }

  try {
    const contentType = req.headers["content-type"];
    const body = ["GET", "HEAD"].includes(req.method || "GET") ? undefined : await readRawBody(req);
    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: req.headers.accept || "application/json",
    };

    if (contentType) {
      headers["Content-Type"] = contentType;
    }

    const cfResponse = await fetch(getTargetUrl(req), {
      method: req.method,
      headers,
      body,
    });

    const responseBody = Buffer.from(await cfResponse.arrayBuffer());
    res.statusCode = cfResponse.status;
    res.setHeader("Content-Type", cfResponse.headers.get("content-type") || "application/json; charset=utf-8");
    res.end(responseBody);
  } catch (error) {
    sendJson(res, 500, { ok: false, error: error instanceof Error ? error.message : "Unknown Cloudflare proxy error" });
  }
};
