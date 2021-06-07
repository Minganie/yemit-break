const mongoose = require("mongoose");

const { Armor } = require("./Armor");
const { Talent } = require("./Talent");
const { User } = require("./User");
const { Weapon } = require("./Weapon");

const toonSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.ObjectId,
      required: true,
      ref: "User",
    },
    name: { type: String, required: true, unique: true },
    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female"],
    },
    species: {
      type: String,
      required: true,
      enum: [
        "Elezen",
        "Hyur",
        "Lalafell",
        "Miqo'te",
        "Roegadyn",
        "Au Ra",
        "Hrothgar",
        "Viera",
      ],
    },
    armor: {
      type: mongoose.ObjectId,
      required: true,
      ref: "Armor",
      autopopulate: true,
    },
    main_hand: {
      type: mongoose.ObjectId,
      required: true,
      ref: "Weapon",
      autopopulate: true,
    },
    off_hand: {
      type: mongoose.ObjectId,
      required: true,
      ref: "Weapon",
      autopopulate: true,
    },
    talents: {
      type: [mongoose.ObjectId],
      ref: "Talent",
      autopopulate: true,
      default: [],
    },
  },
  {
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
  }
);
toonSchema.plugin(require("mongoose-autopopulate"));

const talentIterator = (talents, stat) => {
  let b = 0;
  for (const talent of talents) {
    for (const bonus of talent.bonuses) {
      if (bonus.stat === stat) b += bonus.bonus;
    }
  }
  return b;
};

toonSchema.virtual("smashing").get(function () {
  let smashing = 0;
  smashing += talentIterator(this.talents, "smashing");
  smashing += this.main_hand.smashing;
  smashing += this.off_hand.smashing;
  return smashing;
});
toonSchema.virtual("dodging").get(function () {
  let dodging = 0;
  dodging += talentIterator(this.talents, "dodging");
  dodging += this.armor.dodging;
  dodging += this.main_hand.dodging;
  dodging += this.off_hand.dodging;
  return dodging;
});
toonSchema.virtual("entropy").get(function () {
  let entropy = 0;
  entropy += talentIterator(this.talents, "entropy");
  entropy += this.main_hand.entropy;
  entropy += this.off_hand.entropy;
  return entropy;
});
toonSchema.virtual("harmony").get(function () {
  let harmony = 0;
  harmony += talentIterator(this.talents, "harmony");
  harmony += this.main_hand.harmony;
  harmony += this.off_hand.harmony;
  return harmony;
});
toonSchema.virtual("moxie").get(function () {
  let moxie = 0;
  moxie += talentIterator(this.talents, "moxie");
  moxie += this.main_hand.moxie;
  moxie += this.off_hand.moxie;
  return moxie;
});
toonSchema.virtual("wit").get(function () {
  let wit = 0;
  wit += talentIterator(this.talents, "wit");
  return wit;
});
toonSchema.virtual("hp").get(function () {
  let hp = 0;
  hp += talentIterator(this.talents, "hp");
  hp += this.armor.hp;
  hp += this.main_hand.hp;
  hp += this.off_hand.hp;
  return hp;
});
toonSchema.virtual("stealth").get(function () {
  let stealth = 0;
  stealth += talentIterator(this.talents, "stealth");
  return stealth;
});
toonSchema.virtual("perception").get(function () {
  let perception = 0;
  perception += talentIterator(this.talents, "perception");
  return perception;
});
toonSchema.virtual("intelligence").get(function () {
  let intelligence = 0;
  intelligence += talentIterator(this.talents, "intelligence");
  return intelligence;
});
toonSchema.virtual("science").get(function () {
  let science = 0;
  science += talentIterator(this.talents, "science");
  return science;
});
toonSchema.virtual("mechanics").get(function () {
  let mechanics = 0;
  mechanics += talentIterator(this.talents, "mechanics");
  return mechanics;
});
toonSchema.virtual("charisma").get(function () {
  let charisma = 0;
  charisma += talentIterator(this.talents, "charisma");
  return charisma;
});

const Toon = mongoose.model("Toon", toonSchema);

module.exports = { Toon };
