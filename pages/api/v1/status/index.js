import database from "infra/database.js";

// Configuración para asegurar que esta API se ejecute solo en el servidor
export const config = {
  runtime: 'nodejs',
};

async function status(request, response) {
  const updatedAt = new Date().toISOString();
  let databaseVersionValue, databaseMaxConnectionsValue, databaseOpenedConnectionsValue;

  try {
    console.log("API Status: Iniciando consulta a la base de datos...");
    console.log("Variables de entorno:", {
      POSTGRES_HOST: process.env.POSTGRES_HOST,
      POSTGRES_DATABASE: process.env.POSTGRES_DATABASE,
      NODE_ENV: process.env.NODE_ENV
    });
    
    // Primera consulta: versión del servidor
    try {
      const databaseVersionResult = await database.query("SHOW server_version;");
      databaseVersionValue = databaseVersionResult.rows[0].server_version;
      console.log("API Status: Versión de base de datos obtenida:", databaseVersionValue);
    } catch (error) {
      console.error("Error al obtener versión:", error);
      throw new Error(`Error al obtener versión: ${error.message}`);
    }

    // Segunda consulta: conexiones máximas
    try {
      const databaseMaxConnectionsResult = await database.query("SHOW max_connections;");
      databaseMaxConnectionsValue = databaseMaxConnectionsResult.rows[0].max_connections;
      console.log("API Status: Conexiones máximas obtenidas:", databaseMaxConnectionsValue);
    } catch (error) {
      console.error("Error al obtener conexiones máximas:", error);
      throw new Error(`Error al obtener conexiones máximas: ${error.message}`);
    }

    const databaseName = process.env.POSTGRES_DATABASE || process.env.DB_NAME || "neondb";
    console.log("API Status: Nombre de base de datos usado:", databaseName);
    
    // Tercera consulta: conexiones abiertas
    try {
      const databaseOpenedConnectionsResult = await database.query({
        text: "SELECT count (*)::int FROM pg_stat_activity WHERE datname = $1;",
        values: [databaseName],
      });
      databaseOpenedConnectionsValue = databaseOpenedConnectionsResult.rows[0].count;
      console.log("API Status: Conexiones abiertas:", databaseOpenedConnectionsValue);
    } catch (error) {
      console.error("Error al obtener conexiones abiertas:", error);
      throw new Error(`Error al obtener conexiones abiertas: ${error.message}`);
    }

    console.log("API Status: Enviando respuesta exitosa");
    response.status(200).json({
      updated_at: updatedAt,
      dependencies: {
        database: {
          version: databaseVersionValue,
          max_connections: parseInt(databaseMaxConnectionsValue),
          opened_connections: databaseOpenedConnectionsValue,
        }
      }
    });
  } catch (error) {
    console.error("API Status error:", error);
    console.error("Stack trace:", error.stack);
    
    response.status(500).json({
      error: "Database connection failed",
      message: error.message,
      stack: process.env.NODE_ENV === "production" ? null : error.stack,
      updated_at: updatedAt,
      env: {
        NODE_ENV: process.env.NODE_ENV,
        POSTGRES_HOST: process.env.POSTGRES_HOST ? "Definido" : "No definido",
        DB_HOST: process.env.DB_HOST ? "Definido" : "No definido",
        DATABASE_URL: process.env.DATABASE_URL ? "Definido" : "No definido",
        POSTGRES_DATABASE: process.env.POSTGRES_DATABASE ? "Definido" : "No definido"
      }
    });
  }
}

export default status;
