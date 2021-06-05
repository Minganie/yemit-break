const csv = require("csv-parser");
const debug = require("debug")("talents:mainFunction");
const fs = require("fs");
const mongoose = require("mongoose");

const read = async () => {
  return new Promise((resolve, reject) => {
    const res = [];
    try {
      fs.createReadStream("talents.csv")
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

const strip = (name) => {
  const regex = /\s\(.+\)$/;
  if (!regex.test(name)) throw new Error(`Name "${name}" doesn't fit regex`);
  const rename = name.replace(regex);
  return name.replace(regex, "");
};

const connect = async () => {
  const dbConfig = require("config").get("db");
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

const schema = new mongoose.Schema({
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
const Talent = mongoose.model("Talent", schema);

module.exports = async () => {
  const stats = [
    "Smashing",
    "Dodging",
    "Entropy",
    "Harmony",
    "Moxie",
    "Wit",
    "Stealth",
    "Perception",
    "Intelligence",
    "Science",
    "Mechanics",
    "Charisma",
    "HP",
  ];
  const talents = await read();
  await connect();
  await Talent.deleteMany({});
  for (const talent of talents) {
    debug(`Parsing ${talent.Name}...`);
    const cp = {
      name: strip(talent.Name),
      bonuses: [],
      special: talent.Special || null,
      prerequisites: talent.Requirement ? strip(talent.Requirement) : null,
    };
    for (const stat of stats) {
      if (talent[stat]) {
        cp.bonuses.push({
          bonus: talent[stat],
          stat: stat,
        });
      }
    }
    if (cp.prerequisites) {
      const p = await Talent.findOne({ name: cp.prerequisites });
      if (!p)
        throw new Error(
          `Can't find talent prerequisite "${cp.prerequisites}" in mongo`
        );
      cp.prerequisites = [p._id];
    }
    const t = new Talent({ ...cp });
    await t.save();
    debug(`Saved ${cp.name}`);
  }
  await mongoose.disconnect();
};
