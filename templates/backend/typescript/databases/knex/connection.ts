import knex from "knex";
import { config } from "dotenv";
config();

const connection = knex({
  client: PLUGIN_DB_CLIENT,
  connection: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
  }
});

export default connection;
