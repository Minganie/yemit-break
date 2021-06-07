const mongoose = require("mongoose");
const request = require("supertest");

const { Armor } = require("../models/Armor");
const { Toon } = require("../models/Toon");
const { User } = require("../models/User");
const { Weapon } = require("../models/Weapon");

let server, user, toon, lightArmor, codex, emptyHand;
const endpoint = "/api/toons";

describe("toons", () => {
  beforeAll(async () => {
    server = require("../app");
    user = await new User({
      email: `qa-toons-${Date.now()}@gmail.com`,
      password: Date.now(),
    }).save();
    lightArmor = await Armor.findOne({ name: "Light" });
    codex = await Weapon.findOne({ name: "Scholar Codex" });
    emptyHand = await Weapon.findOne({ name: "Empty" });
  });

  afterAll(async () => {
    await User.deleteOne({ email: user.email });
    await mongoose.disconnect();
  });

  beforeEach(() => {
    toon = {
      name: "C'thu-lu spaced_",
      gender: "Male",
      species: "Au Ra",
      armor: lightArmor._id,
      main_hand: codex._id,
      off_hand: emptyHand._id,
      talents: [],
    };
  });

  describe("POST /", () => {
    it("can create a toon", async () => {
      const res = await request(server)
        .post(endpoint)
        .send(toon)
        .set("x-auth-token", user.getJwt());
      expect(res.status).toBe(201);
      const inDb = await Toon.findOne({ name: toon.name });
      expect(inDb).toBeTruthy();
      await Toon.deleteOne({ name: toon.name });
    });

    it("should refuse a missing name", async () => {
      delete toon.name;
      const res = await request(server)
        .post(endpoint)
        .send(toon)
        .set("x-auth-token", user.getJwt());
      expect(res.status).toBe(400);
    });

    it("should refuse a missing gender", async () => {
      delete toon.gender;
      const res = await request(server)
        .post(endpoint)
        .send(toon)
        .set("x-auth-token", user.getJwt());
      expect(res.status).toBe(400);
    });

    it("should refuse a missing species", async () => {
      delete toon.species;
      const res = await request(server)
        .post(endpoint)
        .send(toon)
        .set("x-auth-token", user.getJwt());
      expect(res.status).toBe(400);
    });

    it("should refuse a missing armor", async () => {
      delete toon.armor;
      const res = await request(server)
        .post(endpoint)
        .send(toon)
        .set("x-auth-token", user.getJwt());
      expect(res.status).toBe(400);
    });

    it("should refuse a missing main hand", async () => {
      delete toon.main_hand;
      const res = await request(server)
        .post(endpoint)
        .send(toon)
        .set("x-auth-token", user.getJwt());
      expect(res.status).toBe(400);
    });

    it("should refuse a missing off hand", async () => {
      delete toon.off_hand;
      const res = await request(server)
        .post(endpoint)
        .send(toon)
        .set("x-auth-token", user.getJwt());
      expect(res.status).toBe(400);
    });

    it("should refuse a missing talent tree", async () => {
      delete toon.talents;
      const res = await request(server)
        .post(endpoint)
        .send(toon)
        .set("x-auth-token", user.getJwt());
      expect(res.status).toBe(400);
    });

    it("should refuse if you're not logged in", async () => {
      const res = await request(server).post(endpoint).send(toon);
      expect(res.status).toBe(401);
    });

    it("should refuse if you're not a player", async () => {
      const observer = await new User({
        email: "Observer@gmail.com",
        password: "observer",
        permissions: [],
      }).save();
      const res = await request(server)
        .post(endpoint)
        .send(toon)
        .set("x-auth-token", observer.getJwt());
      expect(res.status).toBe(403);
      await User.deleteOne({ email: "Observer@gmail.com" });
    });

    it("should refuse a name that already exists", async () => {
      toon = { user: user._id, ...toon };
      await new Toon(toon).save();
      const res = await request(server)
        .post(endpoint)
        .send(toon)
        .set("x-auth-token", user.getJwt());
      expect(res.status).toBe(400);
    });
  });
});
