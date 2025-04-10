// Verificación para asegurar que este módulo solo se ejecute en el servidor
if (typeof window !== 'undefined') {
  throw new Error('This module should only be used on the server side');
}

const { Pool } = require('pg');
require('dotenv').config({ path: '.env.development' });

function getSSLConfig() {
  if (process.env.NODE_ENV === 'development' && process.env.POSTGRES_HOST === 'localhost') {
    return false;
  }

  if (process.env.POSTGRES_HOST?.includes('neon.tech')) {
    console.log('Conectando a Neon.tech con SSL requerido');
    return {
      rejectUnauthorized: false,
      sslmode: 'require'
    };
  }

  return process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false;
}

const pool = new Pool({
  host: process.env.POSTGRES_HOST || 'localhost',
  port: process.env.POSTGRES_PORT || 5432,
  database: process.env.POSTGRES_DATABASE || 'neondb',
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  ssl: getSSLConfig(),
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000
});

pool.on('error', (err) => {
  console.error('Error inesperado en el pool de conexiones:', err);
  console.error('Stack trace:', err.stack);
});

pool.on('connect', () => {
  console.log('Nueva conexión establecida con la base de datos');
});

async function query(queryConfig, values = []) {
  console.log('Intentando conectar a la base de datos...');
  console.log('DB Host:', process.env.POSTGRES_HOST);
  console.log('DB Name:', process.env.POSTGRES_DATABASE);

  const client = await pool.connect();
  try {
    console.log('Conexión establecida correctamente');
    // Si queryConfig es un objeto, úsalo directamente, si no, créalo
    const config = typeof queryConfig === 'string' 
      ? { text: queryConfig, values } 
      : queryConfig;
    
    const result = await client.query(config);
    return result;
  } catch (error) {
    console.error('DB Query Error:', error);
    throw error;
  } finally {
    client.release();
  }
}

module.exports = {
  query,
  pool,
};
