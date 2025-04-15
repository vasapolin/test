// Verificación para asegurar que este módulo solo se ejecute en el servidor
if (typeof window !== "undefined") {
  throw new Error("This module should only be used on the server side");
}

const { Pool } = require("pg");
require("dotenv").config({ path: ".env.development" });
const { DATABASE_URL } = require('./config');

function getSSLConfig() {
  // En desarrollo local, usamos SSL con certificados autofirmados
  if (process.env.NODE_ENV === "development") {
    return {
      rejectUnauthorized: false,
      sslmode: "require"
    };
  }

  // En producción o con Neon.tech, usamos SSL con verificación
  if (process.env.POSTGRES_HOST?.includes("neon.tech")) {
    console.log("Conectando a Neon.tech con SSL requerido");
    return {
      rejectUnauthorized: true,
      sslmode: "require"
    };
  }

  // En producción, requerimos SSL
  return {
    rejectUnauthorized: true,
    sslmode: "require"
  };
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: process.env.NODE_ENV === 'production',
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000,
});

pool.on("error", (err) => {
  console.error("Error inesperado en el pool de conexiones:", err);
  console.error("Stack trace:", err.stack);
});

pool.on("connect", () => {
  console.log("Nueva conexión establecida con la base de datos");
});

async function query(queryConfig, values = []) {
  console.log("Intentando conectar a la base de datos...");
  console.log("DB Host:", process.env.POSTGRES_HOST);
  console.log("DB Name:", process.env.POSTGRES_DATABASE);

  const client = await pool.connect();
  try {
    console.log("Conexión establecida correctamente");
    // Si queryConfig es un objeto, úsalo directamente, si no, créalo
    const config =
      typeof queryConfig === "string"
        ? { text: queryConfig, values }
        : queryConfig;

    const result = await client.query(config);
    return result;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  } finally {
    client.release();
  }
}

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
