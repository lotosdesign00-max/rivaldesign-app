const { withUser, addMessage, handleApi, supabaseRest } = require("./_common");

module.exports = handleApi(async (req, res) => {
  const { body, user } = await withUser(req, res);
  const orderId = body.orderId || body.order_id;
  if (!orderId) throw new Error("Missing orderId");

  const orders = await supabaseRest(`orders?id=eq.${encodeURIComponent(orderId)}&user_id=eq.${encodeURIComponent(user.id)}&select=id`);
  if (!Array.isArray(orders) || !orders.length) throw new Error("Order not found");

  const senderRole = body.senderRole || body.sender_role || "client";
  const senderId = senderRole === "designer" ? null : user.id;
  const message = await addMessage(orderId, senderRole, body.text, body.senderId || body.sender_id || senderId);

  return { message };
});
