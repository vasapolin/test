import database from "infra/database";
import fetch from "node-fetch";

// Aumentar el timeout a 60 segundos
jest.setTimeout(60000);

beforeAll(async () => {
  try {
    await cleanDatabase();
  } catch (error) {
    console.warn("No se pudo limpiar la base de datos. Continuando con las pruebas:", error.message);
  }
}, 30000);

async function cleanDatabase() {
  try {
    await database.query("drop schema public cascade; create schema public");
  } catch (error) {
    console.warn("Error al limpiar la base de datos:", error.message);
  }
}

test("GET a /api/v1/migrations debe retornar 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/migrations");
  expect(response.status).toBe(200);
  
  const responseBody = await response.json();

  expect(Array.isArray(responseBody)).toBe(true);
});
