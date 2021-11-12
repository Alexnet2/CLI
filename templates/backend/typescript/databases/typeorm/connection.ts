import { Connection } from "typeorm";
import { config } from "dotenv";
config();

const connection = new Connection({
  type: PLUGIN_DB_CLIENT,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  entities: [__dirname + "/entity/*.ts"],
}).connect();

export default connection;
