const base64url = require("base64url");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const request = require("supertest");

const auth = require("../middleware/auth");

const { User } = require("../models/User");

let server, observer, player;

const createUser = async (role) => {
  const d = Date.now();
  const permissions = role === "Player" ? ["Player"] : [];
  const data = {
    email: `${role}-${d}@gmail.com`,
    password: `${d}`,
    password_confirmation: `${d}`,
  };
  const res = await request(server).post("/api/users").send(data);
  await User.updateOne({ email: data.email }, { permissions });
  return data;
};

describe("auth", () => {
  beforeAll(async () => {
    server = require("../app");
    player = await createUser("Player");
    observer = await createUser("Observer");
  });

  afterAll(async () => {
    await User.deleteOne({ email: player.email });
    await User.deleteOne({ email: observer.email });
    await mongoose.disconnect();
  });

  it("should say players are authorized", async () => {
    const token = (await User.findOne({ email: player.email })).getJwt();
    const req = {
      header: jest.fn().mockReturnValue(token),
    };
    const res = {};
    const next = jest.fn();
    auth.isPlayer(req, res, next);
    const firstCall = next.mock.calls[0];
    // next is called without argument if no error is encountered
    expect(firstCall.length).toBe(0);
  });

  it("should say non-players are unauthorized", async () => {
    const token = (await User.findOne({ email: observer.email })).getJwt();
    const req = {
      header: jest.fn().mockReturnValue(token),
    };
    const res = {};
    const next = jest.fn();
    auth.isPlayer(req, res, next);
    const firstCall = next.mock.calls[0];
    // next is called with error argument if an error is encountered
    expect(firstCall.length).toBe(1);
    // the error should have status 403 set.
    const error = firstCall[0];
    expect(error.status).toBe(403);
  });

  it("should say anonymous are not allowed", () => {
    const req = {
      header: jest.fn().mockReturnValue(null),
    };
    const res = {};
    const next = jest.fn();
    auth.isLogged(req, res, next);
    const firstCall = next.mock.calls[0];
    expect(firstCall.length).toBe(1);
    // the error should have status 401 set.
    const error = firstCall[0];
    expect(error.status).toBe(401);
  });

  it("should say logged in users are allowed", async () => {
    const token = (await User.findOne({ email: observer.email })).getJwt();
    const req = {
      header: jest.fn().mockReturnValue(token),
    };
    const res = {};
    const next = jest.fn();
    auth.isLogged(req, res, next);
    const firstCall = next.mock.calls[0];
    expect(firstCall.length).toBe(0);
  });

  it("should refuse malformed tokens", async () => {
    const req = {
      header: jest.fn().mockReturnValue("lalalalalèèèère"),
    };
    const res = {};
    const next = jest.fn();
    auth.isLogged(req, res, next);
    const firstCall = next.mock.calls[0];
    expect(firstCall.length).toBe(1);
    // the error should have status 401 set.
    const error = firstCall[0];
    expect(error.status).toBe(401);
  });

  it("should refuse tempered tokens", async () => {
    // Observer makes himself a player...
    let token = (await User.findOne({ email: observer.email })).getJwt();
    const decoded = jwt.decode(token);
    decoded.permissions = ["Player"];
    const recoded = base64url.encode(JSON.stringify(decoded));
    token = token.replace(/\..+?\./, "." + recoded + ".");

    // now tries to access resources...
    const req = {
      header: jest.fn().mockReturnValue(token),
    };
    const res = {};
    const next = jest.fn();
    auth.isLogged(req, res, next);
    const firstCall = next.mock.calls[0];
    expect(firstCall.length).toBe(1);
    // the error should have status 401 set.
    const error = firstCall[0];
    expect(error.status).toBe(401);
  });
});
