import database from "infra/database";
import fetch from "node-fetch";

// Increase timeout to 60 seconds
jest.setTimeout(60000);

beforeAll(async () => {
  try {
    await cleanDatabase();
  } catch (error) {
    console.warn("Could not clean database. Continuing with tests:", error.message);
  }
}, 30000);

async function cleanDatabase() {
  try {
    await database.query("drop schema public cascade; create schema public");
  } catch (error) {
    console.warn("Error cleaning database:", error.message);
  }
}

test("GET to /api/v1/migrations should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/migrations");
  expect(response.status).toBe(200);
  
  const responseBody = await response.json();

  expect(Array.isArray(responseBody)).toBe(true);
});
