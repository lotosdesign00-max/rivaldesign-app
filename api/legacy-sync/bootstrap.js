const { withUser, getUserState, handleApi } = require("./_common");

module.exports = handleApi(async (req, res) => {
  const { user } = await withUser(req, res);
  const state = await getUserState(user.id);
  return {
    user,
    payments: state.payments,
    orders: state.orders,
    messages: state.messages,
    settings: state.settings,
  };
});
