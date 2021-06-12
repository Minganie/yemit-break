const mongoose = require("mongoose");
const request = require("supertest");

const { Armor } = require("../models/Armor");
const { Toon } = require("../models/Toon");
const { User } = require("../models/User");
const { Weapon } = require("../models/Weapon");

let server, user, toon, lightArmor, heavyArmor, codex, emptyHand;
const endpoint = "/api/toons";

describe("toons", () => {
  beforeAll(async () => {
    server = require("../app");
    user = await new User({
      email: `qa-toons-${Date.now()}@gmail.com`,
      password: Date.now(),
    }).save();
    lightArmor = await Armor.findOne({ name: "Light" });
    heavyArmor = await Armor.findOne({ name: "Heavy" });
    codex = await Weapon.findOne({ name: "Scholar Codex" });
    emptyHand = await Weapon.findOne({ name: "Empty" });
  });

  afterAll(async () => {
    await User.deleteOne({ email: user.email });
    await mongoose.disconnect();
  });

  describe("POST /", () => {
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

  describe("PUT /:id", () => {
    let id;

    beforeAll(async () => {
      const res = await request(server)
        .post(endpoint)
        .send({
          name: "Yemropa",
          gender: "Female",
          species: "Miqo'te",
          armor: lightArmor._id,
          main_hand: codex._id,
          off_hand: emptyHand._id,
          talents: [],
        })
        .set("x-auth-token", user.getJwt());
      const yem = await Toon.findOne({ name: "Yemropa" });
      id = yem._id;
    });

    afterAll(async () => {
      await Toon.deleteOne({ name: "Yemropa" });
    });

    beforeEach(() => {
      toon = {
        name: "Yemropa",
        gender: "Female",
        species: "Miqo'te",
        armor: lightArmor._id,
        main_hand: codex._id,
        off_hand: emptyHand._id,
        talents: [],
      };
    });

    it("can update a toon", async () => {
      toon.armor = heavyArmor._id;
      const res = await request(server)
        .put(endpoint + `/${id}`)
        .send(toon)
        .set("x-auth-token", user.getJwt());
      expect(res.status).toBe(201);
      const inDb = await Toon.findOne({ name: toon.name });
      expect(inDb.armor._id.toString()).toEqual(heavyArmor._id.toString());
    });

    it("should refuse a missing name", async () => {
      delete toon.name;
      const res = await request(server)
        .put(endpoint + `/${id}`)
        .send(toon)
        .set("x-auth-token", user.getJwt());
      expect(res.status).toBe(400);
    });

    it("should refuse a missing gender", async () => {
      delete toon.gender;
      const res = await request(server)
        .put(endpoint + `/${id}`)
        .send(toon)
        .set("x-auth-token", user.getJwt());
      expect(res.status).toBe(400);
    });

    it("should refuse a missing species", async () => {
      delete toon.species;
      const res = await request(server)
        .put(endpoint + `/${id}`)
        .send(toon)
        .set("x-auth-token", user.getJwt());
      expect(res.status).toBe(400);
    });

    it("should refuse a missing armor", async () => {
      delete toon.armor;
      const res = await request(server)
        .put(endpoint + `/${id}`)
        .send(toon)
        .set("x-auth-token", user.getJwt());
      expect(res.status).toBe(400);
    });

    it("should refuse a missing main hand", async () => {
      delete toon.main_hand;
      const res = await request(server)
        .put(endpoint + `/${id}`)
        .send(toon)
        .set("x-auth-token", user.getJwt());
      expect(res.status).toBe(400);
    });

    it("should refuse a missing off hand", async () => {
      delete toon.off_hand;
      const res = await request(server)
        .put(endpoint + `/${id}`)
        .send(toon)
        .set("x-auth-token", user.getJwt());
      expect(res.status).toBe(400);
    });

    it("should refuse a missing talent tree", async () => {
      delete toon.talents;
      const res = await request(server)
        .put(endpoint + `/${id}`)
        .send(toon)
        .set("x-auth-token", user.getJwt());
      expect(res.status).toBe(400);
    });

    it("should refuse if you're not logged in", async () => {
      const res = await request(server)
        .put(endpoint + `/${id}`)
        .send(toon);
      expect(res.status).toBe(401);
    });

    it("should refuse updating someone else's toon", async () => {
      // create the other user
      const other = await new User({
        email: `other@gmail.com`,
        password: Date.now(),
      }).save();

      // try to update
      toon.armor = heavyArmor._id;
      const res = await request(server)
        .put(endpoint + `/${id}`)
        .send(toon)
        .set("x-auth-token", other.getJwt());
      expect(res.status).toBe(403);

      //clean up
      await User.deleteOne({ email: "other@gmail.com" });
    });

    it("should refuse to change the name to an existing name", async () => {
      // create the other toon
      let res = await request(server)
        .post(endpoint)
        .send({
          name: "Jhit",
          gender: "Male",
          species: "Miqo'te",
          armor: lightArmor._id,
          main_hand: codex._id,
          off_hand: emptyHand._id,
          talents: [],
        })
        .set("x-auth-token", user.getJwt());
      const jhit = await Toon.findOne({ name: "Jhit" });
      // try to name it Yemropa
      res = await request(server)
        .put(endpoint + `/${jhit._id}`)
        .send({
          name: "Yemropa",
          gender: "Male",
          species: "Miqo'te",
          armor: lightArmor._id,
          main_hand: codex._id,
          off_hand: emptyHand._id,
          talents: [],
        })
        .set("x-auth-token", user.getJwt());
      expect(res.status).toBe(400);
      await Toon.deleteOne({ name: "Jhit" });
    });
  });
});
