const mongooose = require("mongoose");
const passpotLocalMongoose = require("passport-local-mongoose");
const UserSchema = new mongooose.Schema({
  username: String,
  password: String
});
UserSchema.plugin(passpotLocalMongoose);
module.exports = mongooose.model("User", UserSchema);
