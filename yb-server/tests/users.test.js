const mongoose = require("mongoose");
const request = require("supertest");

const { User } = require("../models/User");

let server;
const endpoint = "/api/users";

describe(endpoint, () => {
  beforeAll(() => {
    server = require("../app");
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  describe("POST /", () => {
    let user, email;
    beforeAll(() => {
      email = `qa-users-post-${Date.now()}@gmail.com`;
    });
    beforeEach(() => {
      user = {
        email: email,
        password: "2351a",
        password_confirmation: "2351a",
      };
    });

    it("can create a user", async () => {
      const res = await request(server).post(endpoint).send(user);
      expect(res.status).toBe(201);
      const inDb = await User.findOne({ email: user.email });
      expect(inDb).toBeTruthy();
      await User.deleteOne({ email: user.email });
    });

    it("should refuse mismatched passwords", async () => {
      user.password_confirmation = "2351b";
      const res = await request(server).post(endpoint).send(user);
      expect(res.status).toBe(400);
      const inDb = await User.findOne({ email: user.email });
      expect(inDb).toBeFalsy();
    });

    it("should refuse too short password", async () => {
      user.password = "12";
      user.password_confirmation = "12";
      const res = await request(server).post(endpoint).send(user);
      expect(res.status).toBe(400);
      const inDb = await User.findOne({ email: user.email });
      expect(inDb).toBeFalsy();
    });

    it("should refuse not an email", async () => {
      user.email = `melgmail.com`;
      const res = await request(server).post(endpoint).send(user);
      expect(res.status).toBe(400);
      const inDb = await User.findOne({ email: user.email });
      expect(inDb).toBeFalsy();
    });

    it("should refuse a missing email", async () => {
      delete user.email;
      const res = await request(server).post(endpoint).send(user);
      expect(res.status).toBe(400);
    });

    it("should refuse an empty request", async () => {
      const res = await request(server).post(endpoint).send({});
      expect(res.status).toBe(400);
    });

    it("should refuse a missing password", async () => {
      delete user.password;
      const res = await request(server).post(endpoint).send(user);
      expect(res.status).toBe(400);
      const inDb = await User.findOne({ email: user.email });
      expect(inDb).toBeFalsy();
    });

    it("should refuse a missing password confirmation", async () => {
      delete user.password_confirmation;
      const res = await request(server).post(endpoint).send(user);
      expect(res.status).toBe(400);
      const inDb = await User.findOne({ email: user.email });
      expect(inDb).toBeFalsy();
    });

    it("should refuse an already registered email", async () => {
      await new User(user).save();

      const res = await request(server).post(endpoint).send(user);
      expect(res.status).toBe(400);
      await User.deleteOne({ email: user.email });
    });
  });

  describe("POST /login", () => {
    let user;
    beforeAll(async () => {
      user = {
        email: `qa-users-login-${Date.now()}@gmail.com`,
        password: "2351a",
        password_confirmation: "2351a",
      };
      await request(server).post(endpoint).send(user);
    });

    afterAll(async () => {
      await User.deleteOne({ email: user.email });
    });

    it("can login an existing user user", async () => {
      const res = await request(server)
        .post(endpoint + "/login")
        .send({ email: user.email, password: user.password });
      expect(res.status).toBe(200);
    });

    it("should refuse a bad password", async () => {
      const res = await request(server)
        .post(endpoint + "/login")
        .send({ email: user.email, password: "notzepassword" });
      expect(res.status).toBe(400);
    });

    it("should refuse an unregistered email", async () => {
      const res = await request(server)
        .post(endpoint + "/login")
        .send({ email: "notzeemail@gmail.com", password: "2351a" });
      expect(res.status).toBe(404);
    });

    it("should refuse a missing email", async () => {
      const res = await request(server)
        .post(endpoint + "/login")
        .send({ password: user.password });
      expect(res.status).toBe(400);
    });

    it("should refuse a missing password", async () => {
      const res = await request(server)
        .post(endpoint + "/login")
        .send({ email: user.email });
      expect(res.status).toBe(400);
    });

    it("should refuse an empty request", async () => {
      const res = await request(server)
        .post(endpoint + "/login")
        .send({});
      expect(res.status).toBe(400);
    });
  });

  describe("POST /logout", () => {
    let user;
    beforeAll(async () => {
      user = {
        email: `qa-users-logout-${Date.now()}@gmail.com`,
        password: "2351a",
        password_confirmation: "2351a",
      };
      await request(server).post(endpoint).send(user);
    });

    afterAll(async () => {
      await User.deleteOne({ email: user.email });
    });

    it("can logout a logged in user", async () => {
      const token = (await User.findOne({ email: user.email })).getJwt();
      const res = await request(server)
        .post(endpoint + "/logout")
        .set("x-auth-token", token)
        .send({});
      expect(res.status).toBe(200);
    });

    it("can logout anyone", async () => {
      const res = await request(server)
        .post(endpoint + "/logout")
        .send({});
      expect(res.status).toBe(200);
    });
  });
});
