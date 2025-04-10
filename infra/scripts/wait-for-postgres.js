const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env.development') });

function runCommand(command) {
  try {
    console.log(`Ejecutando: ${command}`);
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`Error ejecutando comando: ${command}`);
    return false;
  }
}

function waitForPostgres() {
  const maxAttempts = 30;
  const delay = 1000; // 1 segundo

  const connectionString = process.env.DATABASE_URL || 
    `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT || 5432}/${process.env.POSTGRES_DATABASE}`;

  // Remover sslmode si ya está en la cadena de conexión
  const cleanConnectionString = connectionString.replace(/\?.*$/, '');
  const finalConnectionString = `${cleanConnectionString}?sslmode=require`;

  for (let i = 0; i < maxAttempts; i++) {
    console.log(`Intento ${i + 1} de ${maxAttempts} para conectar a PostgreSQL...`);
    
    if (runCommand(`psql "${finalConnectionString}" -c "SELECT 1;"`)) {
      console.log('¡Conexión a PostgreSQL exitosa!');
      return;
    }

    console.log(`Esperando ${delay}ms antes del siguiente intento...`);
    new Promise(resolve => setTimeout(resolve, delay));
  }

  console.error('No se pudo conectar a PostgreSQL después de varios intentos');
  process.exit(1);
}

waitForPostgres(); 