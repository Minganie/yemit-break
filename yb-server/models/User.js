const config = require("config");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  permissions: {
    type: [String],
    enum: ["Player"],
    default: ["Player"],
    required: true,
  },
});

userSchema.methods.getJwt = function () {
  const jwtConfig = config.get("jwt");
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      permissions: this.permissions,
    },
    jwtConfig.secret
  );
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
