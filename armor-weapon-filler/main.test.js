const main = require("./mainFonction");

describe("armor and weapon filler", () => {
  it("should fill the test db with static assets", async () => {
    try {
      await main();
    } catch (e) {
      throw e;
    }
  });
});
