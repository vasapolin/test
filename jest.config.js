const dotenv = require("dotenv");
dotenv.config({
  path: ".env.development",
});

const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: ".",
});

const customJestConfig = {
  moduleDirectories: ["node_modules", "<rootDir>/"],
  moduleNameMapper: {
    // Si usás más aliases (ej: app/, shared/, etc.), agrégalos aquí también
    "^infra/(.*)$": "<rootDir>/infra/$1",
  },
  testEnvironment: "node", // opcional, pero recomendado si estás testeando backend
};

module.exports = createJestConfig(customJestConfig);
