import { knex } from "knex";
import { config } from "dotenv";
config();

export const database = knex({
  client: "pg",
  searchPath: [schema || "public"],
  connection: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    user: process.env.DB_USERNAME,
  },
});
