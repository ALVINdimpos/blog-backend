import { Dialect } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

interface DbConfig {
  username: string;
  password: string;
  database: string;
  host: string;
  dialect: Dialect;
}

const config: { [key: string]: DbConfig } = {
  development: {
    username: process.env.DB_USER || "",
    password: process.env.DB_PASS || "",
    database: process.env.DB_NAME || "",
    host: process.env.DB_HOST || "",
    dialect: "postgres",
  },
  test: {
    username: process.env.DB_USER || "",
    password: process.env.DB_PASS || "",
    database: process.env.DB_NAME || "",
    host: process.env.DB_HOST || "",
    dialect: "postgres",
  },
  production: {
    username: process.env.DB_USER || "",
    password: process.env.DB_PASS || "",
    database: process.env.DB_NAME || "",
    host: process.env.DB_HOST || "",
    dialect: "postgres",
  },
};

export default config;
