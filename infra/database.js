// Verificación para asegurar que este módulo solo se ejecute en el servidor
if (typeof window !== 'undefined') {
  throw new Error('This module should only be used on the server side');
}

import { Client } from 'pg';

function getSSLValue() {
  // Verificar si estamos conectando a Neon.tech
  if ((process.env.DB_HOST && process.env.DB_HOST.includes('neon.tech')) ||
      (process.env.POSTGRES_HOST && process.env.POSTGRES_HOST.includes('neon.tech'))) {
    console.log('Conectando a Neon.tech con SSL requerido');
    return { 
      rejectUnauthorized: false,
      sslmode: 'require'
    };
  }

  // Verificar variables URL de base de datos
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.includes('neon.tech')) {
    console.log('Usando DATABASE_URL para Neon.tech con SSL requerido');
    return { 
      rejectUnauthorized: false,
      sslmode: 'require'
    };
  }

  if (process.env.DB_SSL) {
    return { ca: process.env.DB_SSL_CA };
  }

  // Para entorno de producción, usar SSL de manera predeterminada
  if (process.env.NODE_ENV === "production") {
    console.log('Ambiente de producción detectado, usando SSL');
    return { 
      rejectUnauthorized: false,
      sslmode: 'require'
    };
  }

  return false;
}

async function query(queryText, values = []) {
  let client;
  
  try {
    client = new Client({
      host: process.env.POSTGRES_HOST || process.env.DB_HOST,
      port: process.env.POSTGRES_PORT || process.env.DB_PORT || 5432,
      database: process.env.POSTGRES_DATABASE || process.env.DB_NAME,
      user: process.env.POSTGRES_USER || process.env.DB_USER,
      password: process.env.POSTGRES_PASSWORD || process.env.DB_PASSWORD,
      ssl: getSSLValue()
    });

    await client.connect();
    const result = await client.query(queryText, values);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  } finally {
    if (client) {
      await client.end();
    }
  }
}

export default {
  query,
};
