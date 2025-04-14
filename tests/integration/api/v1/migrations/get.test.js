import database from "infra/database";
import fetch from "node-fetch";

// Increase timeout to 60 seconds
jest.setTimeout(60000);

const PORT = process.env.PORT || 3001;

beforeAll(async () => {
  try {
    await cleanDatabase();
  } catch (error) {
    console.warn("Could not clean database. Continuing with tests:", error.message);
  }
}, 30000);

async function cleanDatabase() {
  try {
    // Primero, eliminar todas las tablas existentes
    const tables = await database.query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
    `);

    for (const table of tables.rows) {
      await database.query(`DROP TABLE IF EXISTS "${table.tablename}" CASCADE`);
    }

    // Luego, eliminar la tabla de migraciones si existe
    await database.query(`DROP TABLE IF EXISTS "pgmigrations" CASCADE`);
  } catch (error) {
    console.error("Error limpiando la base de datos:", error.message);
    throw error;
  } finally {
    await database.pool.end();
  }
}

test("GET to /api/v1/migrations should return 200", async () => {
  const response = await fetch(`http://localhost:${PORT}/api/v1/migrations`);
  expect(response.status).toBe(200);
  
  const responseBody = await response.json();
  expect(Array.isArray(responseBody)).toBe(true);
});
