const debug = require("debug")("yb-server:validatorjs");
const mongoose = require("mongoose");
const Validator = require("validatorjs");

const { password } = require("../../common.json");

Validator.register(
  "password",
  (value, requirement, attribute) => {
    return new RegExp(password.regex).test(value);
  },
  password.message
);

Validator.register(
  "mongo_id",
  (value, requirement, attribute) => {
    return mongoose.isValidObjectId(value);
  },
  "The :attribute must be a valid Mongo object id"
);

const validator = (body, rules, customMessages, callback) => {
  const validation = new Validator(body, rules, customMessages);
  validation.passes(() => callback(null, true));
  validation.fails(() => {
    validation.errors.firstMessage =
      validation.errors.all()[Object.keys(validation.errors.all())[0]][0];
    callback(validation.errors, false);
  });
};

module.exports = validator;
