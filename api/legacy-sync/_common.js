const {
  sendJson,
  readJsonBody,
  ensureSupabase,
  supabaseRest,
  getTelegramUser,
  ensureUser,
  money,
  orderByCreatedDesc,
} = require("../_lib/supabase");

async function withUser(req, res) {
  if (!ensureSupabase(res)) throw new Error("Supabase is not configured");
  const body = await readJsonBody(req);
  const telegramUser = getTelegramUser(body);
  const user = await ensureUser(telegramUser);
  if (!user?.id) throw new Error("Unable to create Supabase user");
  return { body, telegramUser, user };
}

async function getUserState(userId) {
  const encodedUser = encodeURIComponent(`eq.${userId}`);
  const [payments, orders, messages, settings] = await Promise.all([
    supabaseRest(`payments?user_id=${encodedUser}&select=*&order=created_at.desc`),
    supabaseRest(`orders?user_id=${encodedUser}&select=*&order=created_at.desc`),
    supabaseRest(`messages?select=*&order=created_at.asc&order_id=in.(${await getOrderIdList(userId)})`).catch(() => []),
    getUserSettings(userId),
  ]);

  return {
    payments: orderByCreatedDesc(payments),
    orders: orderByCreatedDesc(orders),
    messages: Array.isArray(messages) ? messages : [],
    settings,
  };
}

async function getOrderIdList(userId) {
  const encodedUser = encodeURIComponent(`eq.${userId}`);
  const orders = await supabaseRest(`orders?user_id=${encodedUser}&select=id`);
  const ids = Array.isArray(orders) ? orders.map((item) => item.id).filter(Boolean) : [];
  return ids.length ? ids.join(",") : "00000000-0000-0000-0000-000000000000";
}

async function updateUserBalance(userId, nextBalance) {
  const rows = await supabaseRest(`users?id=eq.${encodeURIComponent(userId)}`, {
    method: "PATCH",
    body: { balance: money(nextBalance), updated_at: new Date().toISOString() },
  });
  return Array.isArray(rows) ? rows[0] : rows;
}

async function getUserSettings(userId) {
  try {
    const rows = await supabaseRest(`user_settings?user_id=eq.${encodeURIComponent(userId)}&select=settings`);
    const row = Array.isArray(rows) ? rows[0] : rows;
    return row?.settings && typeof row.settings === "object" ? row.settings : {};
  } catch {
    return {};
  }
}

async function saveUserSettings(userId, patch = {}) {
  const current = await getUserSettings(userId).catch(() => ({}));
  const next = {
    ...(current || {}),
    ...(patch && typeof patch === "object" ? patch : {}),
  };

  const rows = await supabaseRest("user_settings?on_conflict=user_id", {
    method: "POST",
    body: {
      user_id: userId,
      settings: next,
      updated_at: new Date().toISOString(),
    },
    prefer: "resolution=merge-duplicates,return=representation",
  });
  return Array.isArray(rows) ? rows[0] : rows;
}

async function createPayment(userId, payment = {}) {
  const rows = await supabaseRest("payments", {
    method: "POST",
    body: {
      user_id: userId,
      amount: money(payment.amountUSD || payment.amount || 0),
      currency: payment.currency || "USD",
      status: payment.status || "pending",
      crypto_invoice_id: payment.cryptoInvoiceId || payment.crypto_invoice_id || null,
      crypto_pay_url: payment.cryptoPayUrl || payment.crypto_pay_url || null,
      payment_method: payment.method || payment.paymentMethod || payment.payment_method || "cryptobot",
      paid_at: payment.status === "paid" ? new Date().toISOString() : null,
    },
  });
  return Array.isArray(rows) ? rows[0] : rows;
}

async function createOrder(userId, order = {}, paymentId = null) {
  const rows = await supabaseRest("orders", {
    method: "POST",
    body: {
      user_id: userId,
      service_name: order.serviceName || order.service_name || "Design order",
      total_amount: money(order.totalUSD || order.total_amount || 0),
      status: order.status || "waiting_payment",
      payment_id: paymentId,
      brief: order.brief || "",
      designer_notes: order.designerNotes || order.designer_notes || null,
      delivery_url: order.deliveryUrl || order.delivery_url || null,
    },
  });
  return Array.isArray(rows) ? rows[0] : rows;
}

async function addMessage(orderId, senderRole, text, senderId = null) {
  const safeText = String(text || "").trim();
  if (!orderId || !safeText) return null;
  const rows = await supabaseRest("messages", {
    method: "POST",
    body: {
      order_id: orderId,
      sender_id: senderId,
      sender_role: senderRole || "client",
      text: safeText,
    },
  });
  return Array.isArray(rows) ? rows[0] : rows;
}

function handleApi(handler) {
  return async (req, res) => {
    if (req.method !== "POST") {
      sendJson(res, 405, { ok: false, error: "Method not allowed" });
      return;
    }

    try {
      const result = await handler(req, res);
      if (!res.writableEnded) sendJson(res, 200, { ok: true, result });
    } catch (error) {
      if (!res.writableEnded) {
        sendJson(res, 500, { ok: false, error: error instanceof Error ? error.message : "Unknown error" });
      }
    }
  };
}

module.exports = {
  sendJson,
  withUser,
  getUserState,
  updateUserBalance,
  getUserSettings,
  saveUserSettings,
  createPayment,
  createOrder,
  addMessage,
  handleApi,
  money,
  supabaseRest,
};
