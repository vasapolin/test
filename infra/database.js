import { Client } from 'pg';

function getSSLValue() {
  if (process.env.DB_HOST && process.env.DB_HOST.includes('neon.tech')) {
    return { 
      rejectUnauthorized: false,
      sslmode: 'require'
    };
  }

  if (process.env.DB_SSL) {
    return { ca: process.env.DB_SSL_CA };
  }

  return process.env.NODE_ENV === "production" ? true : false;
}

async function query(queryText, values = []) {
  const client = new Client({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: getSSLValue(),
  });

  try {
    await client.connect();
    const result = await client.query(queryText, values);
    return result;
  } catch (error) {
    console.error('DB Query Error:', error);
    throw error;
  } finally {
    await client.end();
  }
}

export default {
  query,
};
