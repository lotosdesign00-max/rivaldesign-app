const {
  sendJson,
  withUser,
  getUserState,
  updateUserBalance,
  saveUserSettings,
  createPayment,
  createOrder,
  addMessage,
  supabaseRest,
  money,
} = require("../_lib/legacy-sync");

function getAction(req) {
  const path = Array.isArray(req.query.path) ? req.query.path : [req.query.path].filter(Boolean);
  return path[0] || "";
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    sendJson(res, 405, { ok: false, error: "Method not allowed" });
    return;
  }

  try {
    const action = getAction(req);
    const { body, user } = await withUser(req, res);

    if (action === "bootstrap") {
      const state = await getUserState(user.id);
      sendJson(res, 200, {
        ok: true,
        result: {
          user,
          payments: state.payments,
          orders: state.orders,
          messages: state.messages,
          settings: state.settings,
        },
      });
      return;
    }

    if (action === "create-topup") {
      const payment = await createPayment(user.id, {
        amountUSD: body.amountUSD || body.amount,
        status: body.status || "pending",
        method: body.method || body.paymentMethod || "cryptobot",
        cryptoInvoiceId: body.cryptoInvoiceId || null,
        cryptoPayUrl: body.cryptoPayUrl || null,
      });

      sendJson(res, 200, { ok: true, result: { user, payment } });
      return;
    }

    if (action === "create-order") {
      const paymentPayload = body.payment || null;
      const orderPayload = body.order || {};
      const payment = paymentPayload ? await createPayment(user.id, paymentPayload) : null;
      const order = await createOrder(user.id, orderPayload, payment?.id || null);

      const incomingMessages = Array.isArray(body.messages) ? body.messages : [];
      const messages = [];
      for (const message of incomingMessages) {
        const saved = await addMessage(
          order.id,
          message.senderRole || message.sender_role || "client",
          message.text,
          message.senderId || message.sender_id || user.id
        );
        if (saved) messages.push(saved);
      }

      sendJson(res, 200, { ok: true, result: { user, payment, order, messages } });
      return;
    }

    if (action === "payment-status") {
      const paymentId = body.paymentId || body.payment_id;
      if (!paymentId) throw new Error("Missing paymentId");

      const paymentStatus = body.status || "pending";
      const paymentPatch = {
        status: paymentStatus,
        updated_at: new Date().toISOString(),
      };
      if (paymentStatus === "paid") paymentPatch.paid_at = new Date().toISOString();

      const paymentRows = await supabaseRest(`payments?id=eq.${encodeURIComponent(paymentId)}&user_id=eq.${encodeURIComponent(user.id)}`, {
        method: "PATCH",
        body: paymentPatch,
      });
      const payment = Array.isArray(paymentRows) ? paymentRows[0] : paymentRows;

      let updatedUser = user;
      if (body.nextBalance !== undefined && body.nextBalance !== null) {
        updatedUser = await updateUserBalance(user.id, money(body.nextBalance));
      }

      let order = null;
      if (body.orderId || body.order_id) {
        const orderRows = await supabaseRest(`orders?id=eq.${encodeURIComponent(body.orderId || body.order_id)}&user_id=eq.${encodeURIComponent(user.id)}`, {
          method: "PATCH",
          body: {
            status: body.orderStatus || body.order_status || "payment_review",
            updated_at: new Date().toISOString(),
          },
        });
        order = Array.isArray(orderRows) ? orderRows[0] : orderRows;

        if (body.note && order?.id) {
          await addMessage(order.id, "designer", body.note, null);
        }
      }

      sendJson(res, 200, { ok: true, result: { user: updatedUser, payment, order } });
      return;
    }

    if (action === "save-settings") {
      const settings = body.settings && typeof body.settings === "object" ? body.settings : {};
      const row = await saveUserSettings(user.id, settings);
      sendJson(res, 200, { ok: true, result: { user, settings: row?.settings || settings } });
      return;
    }

    if (action === "add-message") {
      const orderId = body.orderId || body.order_id;
      if (!orderId) throw new Error("Missing orderId");

      const orders = await supabaseRest(`orders?id=eq.${encodeURIComponent(orderId)}&user_id=eq.${encodeURIComponent(user.id)}&select=id`);
      if (!Array.isArray(orders) || !orders.length) throw new Error("Order not found");

      const senderRole = body.senderRole || body.sender_role || "client";
      const senderId = senderRole === "designer" ? null : user.id;
      const message = await addMessage(orderId, senderRole, body.text, body.senderId || body.sender_id || senderId);

      sendJson(res, 200, { ok: true, result: { message } });
      return;
    }

    sendJson(res, 404, { ok: false, error: "Unknown legacy sync endpoint" });
  } catch (error) {
    if (!res.writableEnded) {
      sendJson(res, 500, { ok: false, error: error instanceof Error ? error.message : "Unknown error" });
    }
  }
};
