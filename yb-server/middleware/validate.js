const debug = require("debug")("yb-server:validate");

const YbValidator = require("../utils/YbValidator");
const YbError = require("../utils/YbError");

const registration = (req, res, next) => {
  const validationRule = {
    email: "email|required",
    password: "password|required|confirmed",
  };
  YbValidator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      next(new YbError(err.firstMessage, 400, err.all()));
    } else {
      next();
    }
  });
};

const login = (req, res, next) => {
  const validationRule = {
    email: "email|required",
    password: "password|required",
  };
  YbValidator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      next(new YbError(err.firstMessage, 400, err.all()));
    } else {
      next();
    }
  });
};

const logout = (req, res, next) => {
  if (req.header("x-auth-token")) next();
  else next(new YbError("No token provided", 400));
};

module.exports = { registration, login, logout };
