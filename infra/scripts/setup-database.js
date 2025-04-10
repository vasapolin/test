const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function runCommand(command) {
  try {
    console.log(`Ejecutando: ${command}`);
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Error ejecutando comando: ${command}`);
    process.exit(1);
  }
}

function setupDatabase() {
  // Verificar si existe el archivo .env
  const envPath = path.join(__dirname, '..', '..', '.env');
  if (!fs.existsSync(envPath)) {
    console.error('Error: No se encontró el archivo .env');
    process.exit(1);
  }

  // Ejecutar migraciones
  runCommand('npm run db:migrate');

  // Ejecutar seeds
  runCommand('npm run db:seed');
}

setupDatabase(); 