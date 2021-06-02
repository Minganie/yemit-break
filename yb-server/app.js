const express = require("express");
require("express-async-errors");

const scribe = require("./utils/scribe");

const app = express();
if (process.env.NODE_ENV === "production") {
  app.use(require("express-force-https"));
}
process.on("uncaughtException", (e) => {
  scribe.error("Uncaught Exception", e);
  process.exitCode = 1;
});
process.on("unhandledRejection", (e) => {
  scribe.error("Unhandled rejection", e);
  process.exitCode = 1;
});

require("./startup/db")();
require("./startup/middleware")(app);
require("./startup/routes")(app);

app.use((err, req, res, next) => {
  res.status(err.status || 500).send(err.message || "Unexpected server error");
});

module.exports = app;
