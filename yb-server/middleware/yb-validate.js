const debug = require("debug")("yb-server:validate");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const { password, sane_string } = require("../../common.json");
const YbError = require("../utils/YbError");

const registration = async (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().pattern(new RegExp(password.regex), "password"),
    password_confirmation: Joi.string().required().valid(Joi.ref("password")),
    permissions: Joi.array(),
  });
  try {
    const val = await schema.validateAsync(req.body);
    next();
  } catch (e) {
    const msg =
      (e.details && e.details[0] && e.details[0].message) ||
      "Unknown validation error";
    next(new YbError(msg, 400));
  }
};

const login = async (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });
  try {
    const val = await schema.validateAsync(req.body);
    next();
  } catch (e) {
    const msg =
      (e.details && e.details[0] && e.details[0].message) ||
      "Unknown validation error";
    next(new YbError(msg, 400));
  }
};

const toon = async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string()
      .pattern(new RegExp(sane_string.regex), "sane string")
      .required(),
    gender: Joi.string().valid("Male", "Female").required(),
    species: Joi.string()
      .valid(
        "Elezen",
        "Hyur",
        "Lalafell",
        "Miqo'te",
        "Roegadyn",
        "Au Ra",
        "Hrothgar",
        "Viera"
      )
      .required(),
    armor: Joi.objectId().required(),
    main_hand: Joi.objectId().required(),
    off_hand: Joi.objectId().required(),
    talents: Joi.array().min(0).required(),
  });
  try {
    const val = await schema.validateAsync(req.body);
    next();
  } catch (e) {
    const msg =
      (e.details && e.details[0] && e.details[0].message) ||
      "Unknown validation error";
    next(new YbError(msg, 400));
  }
};

module.exports = { registration, login, toon };
