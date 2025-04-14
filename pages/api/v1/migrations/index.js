// Este import solo se ejecutará en el servidor
import migrationsRunner from 'node-pg-migrate'
import database from 'infra/database'

// Indica a Next.js que este endpoint solo debe ejecutarse en el servidor
export const config = {
  runtime: 'nodejs',
};

export default async function migrations(request, response) {
  try {
    if (request.method === 'GET') {
      // Para GET, solo verificar las migraciones pendientes
      const pendingMigrations = await migrationsRunner({
        databaseUrl: process.env.DATABASE_URL,
        dryRun: true,
        dir: "infra/migrations",
        direction: "up",
        verbose: true,
      });
      response.status(200).json(pendingMigrations);
    } else if (request.method === 'POST') {
      // Para POST, ejecutar las migraciones
      const migrations = await migrationsRunner({
        databaseUrl: process.env.DATABASE_URL,
        dryRun: false,
        dir: "infra/migrations",
        direction: "up",
        verbose: true,
      });
      response.status(200).json(migrations);
    } else {
      response.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("Error processing migrations:", error);
    response.status(500).json({ error: error.message });
  }
} 
