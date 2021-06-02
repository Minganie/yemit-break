const config = require("config");
const debug = require("debug")("yb-server:db");
const mongoose = require("mongoose");

const dbConfig = config.get("db");
const connString = `mongodb+srv://${dbConfig.user}:${dbConfig.password}@${dbConfig.host}/${dbConfig.name}?ssl=true`;

module.exports = async () => {
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
