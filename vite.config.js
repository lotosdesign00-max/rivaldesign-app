import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import path from "node:path";

const CONTENT_FILE = path.resolve(process.cwd(), "storage/admin-content.json");

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

async function readRawBody(req) {
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

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
}

async function proxyCloudflareAi(req, res, env) {
  const token = env.CLOUDFLARE_API_TOKEN || env.VITE_CLOUDFLARE_API_TOKEN || "";
  if (!token) {
    sendJson(res, 500, { ok: false, error: "Missing CLOUDFLARE_API_TOKEN in server env" });
    return;
  }

  const targetSuffix = String(req.url || "").replace(/^\/api\/cloudflare-ai/, "");
  const targetUrl = `https://api.cloudflare.com/client/v4${targetSuffix}`;
  const contentType = req.headers["content-type"];
  const body = ["GET", "HEAD"].includes(req.method || "GET") ? undefined : await readRawBody(req);
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: req.headers.accept || "application/json",
  };

  if (contentType) {
    headers["Content-Type"] = contentType;
  }

  const cfResponse = await fetch(targetUrl, {
    method: req.method,
    headers,
    body,
  });

  const responseBody = Buffer.from(await cfResponse.arrayBuffer());
  res.statusCode = cfResponse.status;
  res.setHeader("Content-Type", cfResponse.headers.get("content-type") || "application/json; charset=utf-8");
  res.end(responseBody);
}

function getPathname(url = "") {
  return String(url || "").split("?")[0];
}

function ensureContentFile() {
  if (!fs.existsSync(CONTENT_FILE)) {
    fs.mkdirSync(path.dirname(CONTENT_FILE), { recursive: true });
    fs.writeFileSync(CONTENT_FILE, JSON.stringify({
      langs: {},
      gallery: { ru: [], en: [] },
      courses: { ru: [], en: [] },
      reviews: [],
      services: [],
      faq: { ru: [], en: [] },
      home: { stats: [], socials: [] },
      updatedAt: new Date().toISOString(),
    }, null, 2), "utf8");
  }
}

function readContentStore() {
  ensureContentFile();
  return JSON.parse(fs.readFileSync(CONTENT_FILE, "utf8"));
}

function writeContentStore(nextContent) {
  ensureContentFile();
  const payload = {
    ...nextContent,
    updatedAt: new Date().toISOString(),
  };
  fs.writeFileSync(CONTENT_FILE, JSON.stringify(payload, null, 2), "utf8");
  return payload;
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

function createSupabaseAdmin(supabaseUrl, supabaseServiceKey) {
  if (!supabaseUrl || !supabaseServiceKey) return null;
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function buildMetrics({ orders = [], payments = [], users = [] }) {
  const activeOrders = orders.filter((item) => ["waiting_payment", "payment_review", "queued", "in_progress", "preview_sent", "revision"].includes(item.status)).length;
  const unpaidOrders = orders.filter((item) => ["waiting_payment", "payment_review"].includes(item.status)).length;
  const revenue = payments.filter((item) => item.status === "paid").reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const inbox = orders.filter((order) => String(order.service_name || "").toLowerCase().includes("реквизит") || String(order.service_name || "").toLowerCase().includes("payment details")).length;
  return {
    activeOrders,
    unpaidOrders,
    revenue: Number(revenue.toFixed(2)),
    users: users.length,
    inbox,
  };
}

function cryptoPayPlugin(env) {
  const cryptoToken = env.CRYPTOPAY_API_TOKEN || env.CRYPTO_PAY_API_TOKEN || "";
  const defaultAsset = env.CRYPTOPAY_ASSET || "USDT";
  const supabaseUrl = env.SUPABASE_URL || "https://tlzxcghfvgazkzaoawtj.supabase.co";
  const supabaseServiceKey = env.SUPABASE_SERVICE_KEY || "";
  const adminTelegramId = Number(env.ADMIN_TELEGRAM_ID || env.TELEGRAM_ADMIN_ID || 0);
  const supabaseAdmin = createSupabaseAdmin(supabaseUrl, supabaseServiceKey);

  const requireSupabaseAdmin = (res) => {
    if (supabaseAdmin) return true;
    sendJson(res, 500, { ok: false, error: "Missing SUPABASE_SERVICE_KEY" });
    return false;
  };

  const ensureLegacyUser = async (telegramUser = {}) => {
    const telegramId = Number(telegramUser.id || 0);
    if (!telegramId) throw new Error("Missing telegram user");

    const { data: existingUser, error: fetchError } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("telegram_id", telegramId)
      .maybeSingle();

    if (fetchError) throw fetchError;
    if (existingUser) return existingUser;

    const { data: createdUser, error: insertError } = await supabaseAdmin
      .from("users")
      .insert({
        telegram_id: telegramId,
        username: telegramUser.username || null,
        first_name: telegramUser.first_name || null,
        last_name: telegramUser.last_name || null,
        is_admin: adminTelegramId && adminTelegramId === telegramId,
      })
      .select("*")
      .single();

    if (insertError) throw insertError;
    return createdUser;
  };

  const ensureAdminUser = async (telegramUser = {}) => {
    const telegramId = Number(telegramUser.id || 0);
    if (!telegramId) throw new Error("Missing telegram user");
    let user = await ensureLegacyUser(telegramUser);

    if (!user.is_admin && adminTelegramId && telegramId === adminTelegramId) {
      const { data: promoted, error: promoteError } = await supabaseAdmin
        .from("users")
        .update({ is_admin: true })
        .eq("id", user.id)
        .select("*")
        .single();
      if (promoteError) throw promoteError;
      user = promoted;
    }

    if (!user.is_admin) {
      throw new Error("Admin access denied");
    }

    return user;
  };

  const handler = async (req, res, next) => {
    const pathname = getPathname(req.url);

    if (!pathname.startsWith("/api/")) {
      next();
      return;
    }

    try {
      if (req.method === "GET" && pathname === "/api/public-content") {
        sendJson(res, 200, { ok: true, result: readContentStore() });
        return;
      }

      if (pathname.startsWith("/api/cloudflare-ai/")) {
        await proxyCloudflareAi(req, res, env);
        return;
      }

      if (pathname.startsWith("/api/legacy-sync/")) {
        if (!requireSupabaseAdmin(res)) return;

        const body = await readJsonBody(req);

        if (req.method === "POST" && pathname === "/api/legacy-sync/bootstrap") {
          const user = await ensureLegacyUser(body.telegramUser);

          const [{ data: payments, error: paymentsError }, { data: orders, error: ordersError }] = await Promise.all([
            supabaseAdmin.from("payments").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
            supabaseAdmin.from("orders").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
          ]);

          if (paymentsError) throw paymentsError;
          if (ordersError) throw ordersError;

          const orderIds = (orders || []).map((item) => item.id).filter(Boolean);
          let messages = [];

          if (orderIds.length) {
            const { data: dbMessages, error: messagesError } = await supabaseAdmin
              .from("messages")
              .select("*")
              .in("order_id", orderIds)
              .order("created_at", { ascending: true });

            if (messagesError) throw messagesError;
            messages = dbMessages || [];
          }

          sendJson(res, 200, {
            ok: true,
            result: {
              user,
              payments: payments || [],
              orders: orders || [],
              messages,
            },
          });
          return;
        }

        if (req.method === "POST" && pathname === "/api/legacy-sync/create-topup") {
          const user = await ensureLegacyUser(body.telegramUser);
          const amount = Number(body.amountUSD || 0);

          if (!amount || amount <= 0) {
            sendJson(res, 400, { ok: false, error: "Invalid amount" });
            return;
          }

          const { data: payment, error } = await supabaseAdmin
            .from("payments")
            .insert({
              user_id: user.id,
              amount: amount.toFixed(2),
              currency: "USD",
              status: body.status || "pending",
              crypto_invoice_id: body.cryptoInvoiceId || null,
              crypto_pay_url: body.cryptoPayUrl || null,
              payment_method: body.method || "cryptobot",
              paid_at: body.status === "paid" ? new Date().toISOString() : null,
            })
            .select("*")
            .single();

          if (error) throw error;
          sendJson(res, 200, { ok: true, result: { user, payment } });
          return;
        }

        if (req.method === "POST" && pathname === "/api/legacy-sync/create-order") {
          const user = await ensureLegacyUser(body.telegramUser);
          const orderInput = body.order || {};
          const paymentInput = body.payment || null;
          let payment = null;

          if (paymentInput) {
            const { data: paymentRow, error: paymentError } = await supabaseAdmin
              .from("payments")
              .insert({
                user_id: user.id,
                amount: Number(paymentInput.amountUSD || 0).toFixed(2),
                currency: "USD",
                status: paymentInput.status || "pending",
                crypto_invoice_id: paymentInput.cryptoInvoiceId || null,
                crypto_pay_url: paymentInput.cryptoPayUrl || null,
                payment_method: paymentInput.method || "cryptobot",
                paid_at: paymentInput.status === "paid" ? new Date().toISOString() : null,
              })
              .select("*")
              .single();

            if (paymentError) throw paymentError;
            payment = paymentRow;
          }

          const { data: order, error: orderError } = await supabaseAdmin
            .from("orders")
            .insert({
              user_id: user.id,
              service_name: orderInput.serviceName || "Rival Space order",
              total_amount: Number(orderInput.totalUSD || 0).toFixed(2),
              payment_id: payment?.id || null,
              brief: orderInput.brief || "",
              status: orderInput.status || (payment?.status === "paid" ? "queued" : "waiting_payment"),
              designer_notes: orderInput.designerNotes || null,
            })
            .select("*")
            .single();

          if (orderError) throw orderError;

          if (typeof body.nextBalance === "number" && Number.isFinite(body.nextBalance)) {
            const { error: balanceError } = await supabaseAdmin
              .from("users")
              .update({ balance: Number(body.nextBalance).toFixed(2) })
              .eq("id", user.id);
            if (balanceError) throw balanceError;
          }

          if (Array.isArray(body.messages) && body.messages.length) {
            const messagesPayload = body.messages
              .map((message) => ({
                order_id: order.id,
                sender_id: user.id,
                sender_role: message.senderRole || "client",
                text: String(message.text || "").trim(),
              }))
              .filter((message) => message.text);

            if (messagesPayload.length) {
              const { error: messagesError } = await supabaseAdmin.from("messages").insert(messagesPayload);
              if (messagesError) throw messagesError;
            }
          }

          sendJson(res, 200, { ok: true, result: { user, payment, order } });
          return;
        }

        if (req.method === "POST" && pathname === "/api/legacy-sync/payment-status") {
          const paymentId = body.paymentId;
          if (!paymentId) {
            sendJson(res, 400, { ok: false, error: "Missing paymentId" });
            return;
          }

          const updateData = { status: body.status || "pending" };
          if (body.status === "paid") updateData.paid_at = new Date().toISOString();
          if (body.cryptoInvoiceId) updateData.crypto_invoice_id = body.cryptoInvoiceId;
          if (body.cryptoPayUrl) updateData.crypto_pay_url = body.cryptoPayUrl;

          const { data: payment, error: paymentError } = await supabaseAdmin
            .from("payments")
            .update(updateData)
            .eq("id", paymentId)
            .select("*")
            .single();

          if (paymentError) throw paymentError;

          if (typeof body.nextBalance === "number" && Number.isFinite(body.nextBalance) && body.userId) {
            const { error: balanceError } = await supabaseAdmin
              .from("users")
              .update({ balance: Number(body.nextBalance).toFixed(2) })
              .eq("id", body.userId);
            if (balanceError) throw balanceError;
          }

          let order = null;
          if (body.orderId && body.orderStatus) {
            const { data: orderRow, error: orderError } = await supabaseAdmin
              .from("orders")
              .update({
                status: body.orderStatus,
                designer_notes: body.note || undefined,
              })
              .eq("id", body.orderId)
              .select("*")
              .single();

            if (orderError) throw orderError;
            order = orderRow;
          }

          sendJson(res, 200, { ok: true, result: { payment, order } });
          return;
        }

        if (req.method === "POST" && pathname === "/api/legacy-sync/order-status") {
          const orderId = body.orderId;
          if (!orderId) {
            sendJson(res, 400, { ok: false, error: "Missing orderId" });
            return;
          }

          const { data: order, error } = await supabaseAdmin
            .from("orders")
            .update({
              status: body.status || "waiting_payment",
              designer_notes: body.note || undefined,
            })
            .eq("id", orderId)
            .select("*")
            .single();

          if (error) throw error;
          sendJson(res, 200, { ok: true, result: { order } });
          return;
        }

        if (req.method === "POST" && pathname === "/api/legacy-sync/add-message") {
          const orderId = body.orderId;
          const text = String(body.text || "").trim();
          if (!orderId || !text) {
            sendJson(res, 400, { ok: false, error: "Missing orderId or text" });
            return;
          }

          let senderId = body.senderId || null;
          if (!senderId && body.senderRole !== "designer") {
            const user = await ensureLegacyUser(body.telegramUser);
            senderId = user.id;
          }
          if (!senderId && body.senderRole === "designer") {
            senderId = adminUser?.id || null;
          }

          const { data: message, error } = await supabaseAdmin
            .from("messages")
            .insert({
              order_id: orderId,
              sender_id: senderId,
              sender_role: body.senderRole || "client",
              text,
            })
            .select("*")
            .single();

          if (error) throw error;
          sendJson(res, 200, { ok: true, result: { message } });
          return;
        }

        sendJson(res, 404, { ok: false, error: "Not found" });
        return;
      }

      if (req.method === "POST" && pathname === "/api/supabase/update-balance") {
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
            apikey: supabaseServiceKey,
            Authorization: `Bearer ${supabaseServiceKey}`,
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

      if (!pathname.startsWith("/api/crypto-pay/")) {
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

      if (req.method === "POST" && pathname === "/api/crypto-pay/create-invoice") {
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

        if (body.paid_btn_name) payload.paid_btn_name = body.paid_btn_name;
        if (body.paid_btn_url) payload.paid_btn_url = body.paid_btn_url;
        if (body.expires_in) payload.expires_in = body.expires_in;

        const result = await cryptoPayRequest(cryptoToken, "createInvoice", payload);
        sendJson(res, 200, { ok: true, result });
        return;
      }

      if (req.method === "GET" && pathname === "/api/crypto-pay/get-me") {
        const result = await cryptoPayRequest(cryptoToken, "getMe");
        sendJson(res, 200, { ok: true, result });
        return;
      }

      if (req.method === "POST" && pathname === "/api/crypto-pay/get-invoice") {
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
    name: "rival-server-layer",
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
    build: {
      cssCodeSplit: true,
      sourcemap: false,
      minify: "esbuild",
      rollupOptions: {
        input: {
          main: path.resolve(process.cwd(), "index.html"),
        },
        output: {
          manualChunks(id) {
            if (!id.includes("node_modules")) return undefined;
            if (id.includes("react") || id.includes("scheduler")) return "vendor-react";
            if (id.includes("@supabase")) return "vendor-supabase";
            return "vendor";
          },
        },
      },
    },
  };
});
