const debug = require("debug")("yb-server:users");
const express = require("express");
const router = express.Router();

const { Toon } = require("../models/Toon");

const auth = require("../middleware/auth");
const validate = require("../middleware/yb-validate");

router.post("/", [auth.isPlayer, validate.toon], async (req, res, next) => {
  const { body } = req;
  const t = {
    user: req.user._id,
    name: body.name,
    gender: body.gender,
    species: body.species,
    main_hand: body.main_hand,
    off_hand: body.off_hand,
    armor: body.armor,
    talents: body.talents,
  };
  let toon = await new Toon(t).save();
  res.status(201).send(toon);
});

module.exports = router;
