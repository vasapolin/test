import migrationsRunner from 'node-pg-migrate'

export default async function migrations(request, response) {
  try {
    const migrations = await migrationsRunner({
      databaseUrl: process.env.DATABASE_URL,
      dryRun: true,
      dir: "infra/migrations",
      direction: "up",
      verbose: true,
    });
    response.status(200).json(migrations);
  } catch (error) {
    console.error("Error processing migrations:", error);
    response.status(200).json([]);
  }
} 
