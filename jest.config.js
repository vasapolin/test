const dotenv = require("dotenv");
dotenv.config({
  path: ".env.development",
});

const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: ".",
});

const customJestConfig = {
  testEnvironment: "node",
  transform: {
    "^.+\\.js$": "babel-jest"
  },
  moduleNameMapper: {
    "^infra/(.*)$": "<rootDir>/infra/$1"
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"]
};

module.exports = createJestConfig(customJestConfig);
