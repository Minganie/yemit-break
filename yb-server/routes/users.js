const bcrypt = require("bcrypt");
const debug = require("debug")("yb-server:users");
const express = require("express");
const router = express.Router();

const { User } = require("../models/User");
const YbError = require("../utils/YbError");

const validate = require("../middleware/validate");

/* GET users listing. */
router.post("/", validate.registration, async (req, res, next) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(req.body.password, salt);
    let user = new User({
      email: req.body.email,
      password: hashed,
    });
    user = await user.save();
    const payload = { ...user };
    payload.jwt = user.getJwt();
    res.status(201).send(payload);
  } catch (ex) {
    if (ex.code && ex.code === 11000) {
      next(
        new YbError("A user with the given email is already registered.", 400)
      );
    } else {
      next(new YbError("Internal Server Error", 500));
    }
  }
});

module.exports = router;
