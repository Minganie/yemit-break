const mongoose = require("mongoose");
const request = require("supertest");

const { User } = require("../models/User");

let servers;
let mel;
const endpoint = "/api/users";

const createMel = async () => {
  return await request(servers.https).post(endpoint).send({
    email: "mel@gmail.com",
    password: "2351a",
    password_confirmation: "2351a",
  });
};

describe(endpoint, () => {
  beforeAll(() => {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    servers = require("../bin/www");
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await servers.http.close();
    await servers.https.close();
  });

  describe("POST /", () => {
    afterEach(async () => {
      await User.deleteMany({});
    });

    it("can create a user", async () => {
      const email = `qa-${Date.now()}@gmail.com`;
      const res = await request(servers.https).post(endpoint).send({
        email,
        password: "2351a",
        password_confirmation: "2351a",
      });
      expect(res.status).toBe(201);
      const inDb = await User.findOne({ email });
      expect(inDb).toBeTruthy();
      await User.deleteOne({ email });
    });

    it("should refuse mismatched passwords", async () => {
      const email = `qa-${Date.now()}@gmail.com`;
      const res = await request(servers.https).post(endpoint).send({
        email,
        password: "12345",
        password_confirmation: "21345",
      });
      expect(res.status).toBe(400);
      const inDb = await User.findOne({ email });
      expect(inDb).toBeFalsy();
    });

    it("should refuse too short password", async () => {
      const email = `qa-${Date.now()}@gmail.com`;
      const res = await request(servers.https).post(endpoint).send({
        email,
        password: "12",
        password_confirmation: "12",
      });
      expect(res.status).toBe(400);
      const inDb = await User.findOne({ email });
      expect(inDb).toBeFalsy();
    });

    it("should refuse not an email", async () => {
      const email = `melgmail.com`;
      const res = await request(servers.https).post(endpoint).send({
        email,
        password: "2351a",
        password_confirmation: "2351a",
      });
      expect(res.status).toBe(400);
      const inDb = await User.findOne({ email });
      expect(inDb).toBeFalsy();
    });

    it("should refuse a missing email", async () => {
      const res = await request(servers.https).post(endpoint).send({
        password: "2351a",
        password_confirmation: "2351a",
      });
      expect(res.status).toBe(400);
    });

    it("should refuse an empty request", async () => {
      const res = await request(servers.https).post(endpoint).send({});
      expect(res.status).toBe(400);
    });

    it("should refuse a missing password", async () => {
      const email = `qa-${Date.now()}@gmail.com`;
      const res = await request(servers.https).post(endpoint).send({
        email,
        password_confirmation: "2351a",
      });
      expect(res.status).toBe(400);
      const inDb = await User.findOne({ email });
      expect(inDb).toBeFalsy();
    });

    it("should refuse a missing password confirmation", async () => {
      const email = `qa-${Date.now()}@gmail.com`;
      const res = await request(servers.https).post(endpoint).send({
        email,
        password: "2351a",
      });
      expect(res.status).toBe(400);
      const inDb = await User.findOne({ email });
      expect(inDb).toBeFalsy();
    });

    it("should refuse an already registered email", async () => {
      mel = await createMel();

      const res = await request(servers.https).post(endpoint).send({
        email: `mel@gmail.com`,
        password: "789456",
        password_confirmation: "789456",
      });
      expect(res.status).toBe(400);
    });
  });

  describe("POST /login", () => {
    beforeEach(async () => {
      mel = await createMel();
    });

    afterEach(async () => {
      await User.deleteMany({});
    });

    it("can login an existing user user", async () => {
      const res = await request(servers.https)
        .post(endpoint + "/login")
        .send({ email: "mel@gmail.com", password: "2351a" });
      expect(res.status).toBe(200);
    });

    it("should refuse a bad password", async () => {
      const res = await request(servers.https)
        .post(endpoint + "/login")
        .send({ email: "mel@gmail.com", password: "2351s" });
      expect(res.status).toBe(400);
    });

    it("should refuse an unregistered email", async () => {
      const res = await request(servers.https)
        .post(endpoint + "/login")
        .send({ email: "mela@gmail.com", password: "2351a" });
      expect(res.status).toBe(404);
    });

    it("should refuse a missing email", async () => {
      const res = await request(servers.https)
        .post(endpoint + "/login")
        .send({ password: "2351a" });
      expect(res.status).toBe(400);
    });

    it("should refuse a missing password", async () => {
      const res = await request(servers.https)
        .post(endpoint + "/login")
        .send({ email: "mel@gmail.com" });
      expect(res.status).toBe(400);
    });

    it("should refuse an empty request", async () => {
      const res = await request(servers.https)
        .post(endpoint + "/login")
        .send({});
      expect(res.status).toBe(400);
    });
  });

  describe("POST /logout", () => {
    beforeEach(async () => {
      const mel = await createMel();
    });

    afterEach(async () => {
      await User.deleteMany({});
    });

    it("can logout a logged in user", async () => {
      const token = (await User.findOne({ email: "mel@gmail.com" })).getJwt();
      const res = await request(servers.https)
        .post(endpoint + "/logout")
        .set("x-auth-token", token)
        .send({});
      expect(res.status).toBe(200);
    });

    it("should refuse an anonymous user", async () => {
      const res = await request(servers.https)
        .post(endpoint + "/logout")
        .send({});
      expect(res.status).toBe(400);
    });
  });
});