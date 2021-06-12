const debug = require("debug")("yb-server:users");
const express = require("express");
const router = express.Router();

const { Toon } = require("../models/Toon");

const auth = require("../middleware/auth");
const validate = require("../middleware/yb-validate");
const YbError = require("../utils/YbError");

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

router.put(
  "/:id",
  [auth.isPlayer, validate.paramIsMongoId, validate.toon],
  async (req, res, next) => {
    try {
      const toon = await Toon.findOne({ _id: req.params.id });
      if (!toon) return next(new YbError(`Can't find that toon`, 404));
      if (toon.user.toString() !== req.user._id) {
        return next(new YbError("This isn't your toon.", 403));
      }
      const { body } = req;
      const t = {
        name: body.name,
        gender: body.gender,
        species: body.species,
        main_hand: body.main_hand,
        off_hand: body.off_hand,
        armor: body.armor,
        talents: body.talents,
      };
      let updated = await Toon.findByIdAndUpdate(req.params.id, t, {
        new: true,
      });
      res.status(201).send(updated);
    } catch (e) {
      if (e.code && e.code === 11000) {
        next(
          new YbError(`A toon named "${req.body.name}" already exists.`, 400)
        );
      } else next(e);
    }
  }
);

module.exports = router;
