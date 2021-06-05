const config = require("config");
const csv = require("csv-parser");
const debug = require("debug")("filler:mainFonction");
const fs = require("fs");
const mongoose = require("mongoose");

const connect = async () => {
  const dbConfig = config.get("db");
  const connString = `mongodb+srv://${dbConfig.user}:${dbConfig.password}@${dbConfig.host}/${dbConfig.name}?ssl=true`;
  try {
    await mongoose.connect(connString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    debug("Successfully connected to Mongo");
  } catch (e) {
    debug("Failed to connect to Mongo", e);
    throw e;
  }
};

const read = async (filename) => {
  return new Promise((resolve, reject) => {
    const res = [];
    try {
      fs.createReadStream(filename)
        .pipe(csv())
        .on("data", (data) => {
          return res.push(data);
        })
        .on("end", () => resolve(res));
    } catch (e) {
      reject(e);
    }
  });
};

const armorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  hp: {
    type: Number,
    required: true,
  },
  dodging: {
    type: Number,
    required: true,
  },
});

const Armor = mongoose.model("Armor", armorSchema);

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

const parseArmors = async () => {
  const armors = await read("armors.csv");
  await Armor.deleteMany({});
  for (const armor of armors) {
    await new Armor({
      name: armor.Armor,
      hp: armor.HP,
      dodging: armor.Dodging,
    }).save();
  }
};

const parseWeapons = async () => {
  const weapons = await read("weapons.csv");
  const main_hands = await read("main-hands.csv");
  await Weapon.deleteMany({});
  for (const weapon of weapons) {
    const zeHand = main_hands.find((m) => {
      return m.Weapon === weapon.Weapon;
    });
    await new Weapon({
      name: weapon.Weapon,
      smashing: weapon.Smashing,
      dodging: weapon.Dodging,
      entropy: weapon.Entrophy,
      harmony: weapon.Harmony,
      moxie: weapon.Moxie,
      hp: weapon.HP,
      hands: zeHand.Hands,
    }).save();
  }
};

module.exports = async () => {
  await connect();
  await parseArmors();
  await parseWeapons();
  await mongoose.disconnect();
};
