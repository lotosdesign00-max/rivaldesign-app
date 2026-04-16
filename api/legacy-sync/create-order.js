const { withUser, createPayment, createOrder, addMessage, handleApi } = require("./_common");

module.exports = handleApi(async (req, res) => {
  const { body, user } = await withUser(req, res);
  const paymentPayload = body.payment || null;
  const orderPayload = body.order || {};

  const payment = paymentPayload
    ? await createPayment(user.id, paymentPayload)
    : null;

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

  return { user, payment, order, messages };
});
