import { Client } from "pg";

async function query(queryString) {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DATABASE,
    password: process.env.POSTGRES_PASSWORD,
    ssl: {
      rejectUnauthorized: false, // Permite conexiones SSL sin verificación estricta del certificado
    },
  });
  await client.connect();
  const result = await client.query(queryString);
  await client.end();
  return result
}

export default{
  query: query,
};
