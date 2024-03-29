const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

module.exports = (app) => {
  app.use(logger("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, "public")));
  if (process.env.NODE_ENV === "production") {
    app.use(require("express-force-https"));
  } else {
    app.use(require("cors")());
  }
};
