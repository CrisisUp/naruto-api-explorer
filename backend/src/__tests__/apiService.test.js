// backend/src/__tests__/apiService.test.js
const apiService = require("../services/apiService");

describe("ApiService", () => {
  test("deve ter o método formatCharacter", () => {
    expect(typeof apiService.formatCharacter).toBe("function");
  });

  test("deve ter o método getCharacters", () => {
    expect(typeof apiService.getCharacters).toBe("function");
  });

  test("deve ter o método getTopJutsu", () => {
    expect(typeof apiService.getTopJutsu).toBe("function");
  });
});
