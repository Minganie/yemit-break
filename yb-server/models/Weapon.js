const mongoose = require("mongoose");

const weaponSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  smashing: {
    type: Number,
    required: true,
  },
  dodging: {
    type: Number,
    required: true,
  },
  entropy: {
    type: Number,
    required: true,
  },
  harmony: {
    type: Number,
    required: true,
  },
  hp: {
    type: Number,
    required: true,
  },
  moxie: {
    type: Number,
    required: true,
  },
  hands: {
    type: Number,
    required: true,
    min: 0,
    max: 2,
  },
});

const Weapon = mongoose.model("Weapon", weaponSchema);

module.exports = { Weapon, weaponSchema };
