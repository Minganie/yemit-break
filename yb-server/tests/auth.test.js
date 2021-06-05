const mongoose = require("mongoose");
const request = require("supertest");

const { User } = require("../models/User");

let server, user;

const createUser = async () => {
  const d = Date.now();
  const data = {
    email: `qa-${d}@gmail.com`,
    password: `${d}`,
    password_confirmation: `${d}`,
  };
  await request(server).post("/api/users").send(data);
  return data;
};

describe("auth", () => {
  beforeAll(async () => {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    server = require("../app");
    user = await createUser();
  });

  afterAll(async () => {
    await User.deleteOne({ email: user.email });
    await mongoose.disconnect();
  });

  it("should accept authenticated users", async () => {
    const token = (await User.findOne({ email: user.email })).getJwt();
    // const res = await request(server)
    //   .post("/api/toons")
    //   .send({})
    //   .set("x-auth-token", token);
    // expect(res.status).toBe(200);
  });

  it("should refuse anonymous users", async () => {
    // const res = await request(server).post("/api/toons").send({});
    // expect(res.status).toBe(401);
  });

  it("should refuse bad tokens", async () => {
    // const res = await request(server)
    //   .post("/api/toons")
    //   .send({})
    //   .set("x-auth-token", "lalalalalèèèère");
    // expect(res.status).toBe(401);
  });

  it("should refuse tempered tokens", async () => {
    // const playerWhoMadeHimselfDm =
    //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MGJhOTQ1MWZkZGI2ZDA4MmM5N2U3NDUiLCJlbWFpbCI6Im1lbEBnbWFpbC5jb20iLCJwZXJtaXNzaW9ucyI6WyJETSJdLCJpYXQiOjE2MjI4NDA0MDJ9.AhymgngmXJhEsOfhptNemTcmeNAM9hZBN59GSLFwYQU";
    // const res = await request(server)
    //   .post("/api/toons")
    //   .send({})
    //   .set("x-auth-token", playerWhoMadeHimselfDm);
    // expect(res.status).toBe(401);
  });
});
