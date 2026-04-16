const { withUser, saveUserSettings, handleApi } = require("./_common");

module.exports = handleApi(async (req, res) => {
  const { body, user } = await withUser(req, res);
  const settings = body.settings && typeof body.settings === "object" ? body.settings : {};
  const row = await saveUserSettings(user.id, settings);
  return { user, settings: row?.settings || settings };
});
