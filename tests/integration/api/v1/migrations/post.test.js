import database from "infra/database";
import fetch from "node-fetch";

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

test("POST to /api/v1/migrations should return 200 and an array", async () => {
  const response1 = await fetch("http://localhost:3000/api/v1/migrations", {
    method: 'POST',
  });
  expect(response1.status).toBe(200);
  
  const response1Body = await response1.json();

  expect(Array.isArray(response1Body)).toBe(true);
});

test("POST to /api/v1/migrations in second call should return empty array", async () => {
  const response2 = await fetch("http://localhost:3000/api/v1/migrations", {
    method: 'POST',
  });
  expect(response2.status).toBe(200);
  
  const response2Body = await response2.json();

  expect(Array.isArray(response2Body)).toBe(true);
  expect(response2Body.length).toBe(0);
});
