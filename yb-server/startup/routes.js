const indexRouter = require("../routes/index");
const toonsRouter = require("../routes/toons");
const usersRouter = require("../routes/users");

module.exports = (app) => {
  app.use("/", indexRouter);
  app.use("/api/toons", toonsRouter);
  app.use("/api/users", usersRouter);
};
