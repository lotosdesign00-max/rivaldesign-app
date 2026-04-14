import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

async function readJsonBody(req) {
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

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
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

function cryptoPayPlugin(env) {
  const cryptoToken = env.CRYPTOPAY_API_TOKEN || env.CRYPTO_PAY_API_TOKEN || "";
  const defaultAsset = env.CRYPTOPAY_ASSET || "USDT";
  const supabaseUrl = env.SUPABASE_URL || "https://tlzxcghfvgazkzaoawtj.supabase.co";
  const supabaseServiceKey = env.SUPABASE_SERVICE_KEY || "";

  const handler = async (req, res, next) => {
    if (!req.url?.startsWith("/api/")) {
      next();
      return;
    }

    try {
      // ─── UPDATE BALANCE ───────────────────────────────────────────────
      if (req.method === "POST" && req.url === "/api/supabase/update-balance") {
        const body = await readJsonBody(req);
        const { userId, balance } = body;

        if (!userId || balance === undefined) {
          sendJson(res, 400, { ok: false, error: "Missing userId or balance" });
          return;
        }

        if (!supabaseServiceKey) {
          sendJson(res, 500, { ok: false, error: "Missing SUPABASE_SERVICE_KEY" });
          return;
        }

        const response = await fetch(`${supabaseUrl}/rest/v1/users?id=eq.${userId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "apikey": supabaseServiceKey,
            "Authorization": `Bearer ${supabaseServiceKey}`,
          },
          body: JSON.stringify({ balance, updated_at: new Date().toISOString() }),
        });

        if (!response.ok) {
          const errText = await response.text();
          sendJson(res, response.status, { ok: false, error: errText });
          return;
        }

        sendJson(res, 200, { ok: true });
        return;
      }

      // ─── CRYPTO PAY: CREATE INVOICE ───────────────────────────────────
      if (!req.url?.startsWith("/api/crypto-pay/")) {
        next();
        return;
      }

      if (!cryptoToken) {
        sendJson(res, 500, {
          ok: false,
          error: "Missing CRYPTOPAY_API_TOKEN in server env",
        });
        return;
      }

      if (req.method === "POST" && req.url === "/api/crypto-pay/create-invoice") {
        const body = await readJsonBody(req);
        const amount = Number(body.amount || body.amountUSD || 0);
        if (!amount || amount <= 0) {
          sendJson(res, 400, { ok: false, error: "Invalid amount" });
          return;
        }

        const payload = {
          asset: body.asset || defaultAsset,
          amount: amount.toFixed(2),
          description: body.description || "Rival Design payment",
          hidden_message: body.hiddenMessage || "Rival Design payment draft",
          payload: body.payload || "",
          allow_comments: false,
          allow_anonymous: false,
        };

        const result = await cryptoPayRequest(cryptoToken, "createInvoice", payload);
        sendJson(res, 200, { ok: true, result });
        return;
      }

      if (req.method === "POST" && req.url === "/api/crypto-pay/get-invoice") {
        const body = await readJsonBody(req);
        const invoiceId = Number(body.invoiceId || body.invoice_id || 0);
        if (!invoiceId) {
          sendJson(res, 400, { ok: false, error: "Missing invoiceId" });
          return;
        }

        const result = await cryptoPayRequest(cryptoToken, "getInvoices", { invoice_ids: [invoiceId] });
        const invoice = Array.isArray(result?.items) ? result.items[0] : null;
        sendJson(res, 200, { ok: true, result: invoice || null });
        return;
      }

      sendJson(res, 404, { ok: false, error: "Not found" });
    } catch (error) {
      sendJson(res, 500, {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  return {
    name: "rival-crypto-pay",
    configureServer(server) {
      server.middlewares.use(handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler);
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), cryptoPayPlugin(env)],
    server: {
      proxy: {
        "/api/cloudflare-ai": {
          target: "https://api.cloudflare.com/client/v4",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/cloudflare-ai/, ""),
        },
      },
    },
  };
});
