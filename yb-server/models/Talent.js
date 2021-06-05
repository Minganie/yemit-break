const mongoose = require("mongoose");

const talentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  bonuses: [
    {
      bonus: { type: Number, required: true },
      stat: { type: String, required: true },
    },
  ],
  special: { type: String, required: false },
  prerequisites: [
    {
      type: mongoose.ObjectId,
      ref: "Talent",
    },
  ],
});

const Talent = mongoose.model("Talent", talentSchema);

module.exports = { Talent };
