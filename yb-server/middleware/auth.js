const config = require("config");
const jwt = require("jsonwebtoken");

const YbError = require("../utils/YbError");

const tokenIsPresent = (req) => {
  const token = req.header("x-auth-token");
  if (!token)
    throw new YbError("You must be logged in to access this resource.", 401);
};

const tokenIsValid = (token) => {
  const jwtConfig = config.get("jwt");
  try {
    return jwt.verify(token, jwtConfig.secret);
  } catch (e) {
    throw new YbError(
      "Invalid token provided; try logging out and logging back in.",
      401
    );
  }
};

const isLogged = (req, res, next) => {
  tokenIsPresent(req);
  tokenIsValid(req.header("x-auth-token"));
  next();
};

const isPlayer = (req, res, next) => {
  tokenIsPresent(req);
  req.user = tokenIsValid(req.header("x-auth-token"));

  if (!req.user.permissions.includes("Player"))
    throw new YbError(
      "You must be logged in as a player to access this resource.",
      403
    );

  next();
};

module.exports = { isLogged, isPlayer };
