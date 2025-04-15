const path = require("path");
const dotenv = require("dotenv");
const fs = require("fs");

const envPath = path.resolve(__dirname, ".env.development");

if (!fs.existsSync(envPath)) {
  process.exit(1);
}

dotenv.config({ path: envPath });

Object.assign(process.env, {
  DB_HOST: process.env.PGHOST,
  DB_PORT: "5432",
  DB_USER: process.env.PGUSER,
  DB_PASSWORD: process.env.PGPASSWORD,
  DB_NAME: process.env.PGDATABASE,
});

process.env.DATABASE_URL =
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL ||
  `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?sslmode=require&connect_timeout=30`;
