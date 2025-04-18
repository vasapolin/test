import database from "infra/database";
import fetch from "node-fetch";

jest.setTimeout(60000);

const PORT = process.env.PORT || 3000;

beforeAll(async () => {
  try {
    await waitForServer();
  } catch (error) {
    console.warn("Could not wait for server:", error.message);
  }
}, 30000);

afterAll(async () => {
  try {
    await database.pool.end();
  } catch (error) {
    console.warn("Error closing database pool:", error.message);
  }
});

async function waitForServer(retries = 30, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(
        `http://localhost:${PORT}/api/v1/migrations`,
      );
      if (response.status === 200) {
        return;
      }
    } catch (error) {
      console.log(
        `Intento ${i + 1}/${retries}: El servidor aún no está listo...`,
      );
    }
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
  throw new Error("El servidor no respondió después de varios intentos");
}

test("POST to /api/v1/migrations should return 200 and a valid array", async () => {
  const response = await fetch(`http://localhost:${PORT}/api/v1/migrations`, {
    method: "POST",
  });
  expect(response.status).toBe(200);

  const responseBody = await response.json();
  expect(Array.isArray(responseBody)).toBe(true);
  
  // Verificar que cada elemento del array tenga la estructura esperada
  responseBody.forEach((migration) => {
    expect(migration).toHaveProperty("id");
    expect(migration).toHaveProperty("name");
    expect(migration).toHaveProperty("created_at");
    expect(typeof migration.id).toBe("number");
    expect(typeof migration.name).toBe("string");
    expect(migration.created_at).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
  });
});

test("POST to /api/v1/migrations in second call should return empty array", async () => {
  const response = await fetch(`http://localhost:${PORT}/api/v1/migrations`, {
    method: "POST",
  });
  expect(response.status).toBe(200);

  const responseBody = await response.json();
  expect(Array.isArray(responseBody)).toBe(true);
  expect(responseBody.length).toBe(0);
});
