const config = require("config");
const winston = require("winston");

const logsConfig = config.get("logs");

const scribe = winston.createLogger({
  level: "info",
  format: winston.format.simple(),
  transports: [
    new winston.transports.File({ filename: logsConfig.error, level: "error" }),
  ],
  exceptionHandlers: [
    new winston.transports.File({
      filename: logsConfig.critical,
      level: "error",
    }),
  ],
});

module.exports = scribe;
