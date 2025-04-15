const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

function runCommand(command) {
  try {
    console.log(`Ejecutando: ${command}`);
    execSync(command, { stdio: "inherit" });
  } catch (error) {
    console.error(`Error ejecutando comando: ${command}`);
    process.exit(1);
  }
}

function setupTestEnvironment() {
  // Crear directorio de scripts si no existe
  const scriptsDir = path.join(__dirname, "..", "infra", "scripts");
  if (!fs.existsSync(scriptsDir)) {
    fs.mkdirSync(scriptsDir, { recursive: true });
  }

  // Copiar archivos de configuración
  const configFiles = [".prettierrc", ".prettierignore"];
  configFiles.forEach((file) => {
    const source = path.join(__dirname, "..", file);
    const dest = path.join(scriptsDir, file);
    if (fs.existsSync(source)) {
      fs.copyFileSync(source, dest);
    }
  });

  // Instalar dependencias
  runCommand("npm install");

  // Configurar base de datos
  runCommand("npm run db:setup");
}

function runTests() {
  // Ejecutar pruebas
  runCommand("npm test");
}

function main() {
  try {
    setupTestEnvironment();
    runTests();
  } catch (error) {
    console.error("Error en el orquestador de pruebas:", error);
    process.exit(1);
  }
}

main();
