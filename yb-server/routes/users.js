const bcrypt = require("bcrypt");
const debug = require("debug")("yb-server:users");
const express = require("express");
const router = express.Router();

const { User } = require("../models/User");
const YbError = require("../utils/YbError");

const validate = require("../middleware/yb-validate");

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

router.post("/login", validate.login, async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) throw new YbError("No user is registered with this email", 404);

  const validPassword = await bcrypt.compare(req.body.password, user.password);

  if (!validPassword)
    throw new YbError("Invalid username and password combination", 400);

  const payload = { ...user };
  payload.jwt = user.getJwt();

  res.status(200).send(payload);
});

router.post("/logout", async (req, res, next) => {
  // we're actually not checking whether they're logged in, since it only changes things client-side and doesn't change anything server-side
  res.status(200).send({});
});

module.exports = router;
