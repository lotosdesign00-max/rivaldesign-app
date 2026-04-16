const { withUser, updateUserBalance, addMessage, handleApi, supabaseRest, money } = require("./_common");

module.exports = handleApi(async (req, res) => {
  const { body, user } = await withUser(req, res);
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

  return { user: updatedUser, payment, order };
});
