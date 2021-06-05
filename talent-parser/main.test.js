const main = require("./mainFunction");

describe("talent parser", () => {
  it("should fill the test db with static assets", async () => {
    await main();
  });
});
