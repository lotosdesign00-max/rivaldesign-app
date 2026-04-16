const { withUser, createPayment, handleApi } = require("./_common");

module.exports = handleApi(async (req, res) => {
  const { body, user } = await withUser(req, res);
  const payment = await createPayment(user.id, {
    amountUSD: body.amountUSD || body.amount,
    status: body.status || "pending",
    method: body.method || body.paymentMethod || "cryptobot",
    cryptoInvoiceId: body.cryptoInvoiceId || null,
    cryptoPayUrl: body.cryptoPayUrl || null,
  });

  return { user, payment };
});
