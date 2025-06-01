import { Knex, knex } from "knex";
import { env } from "@/config/env";

export const config: Knex.Config = {
  client: env.database.client,
  connection: {
    host: env.database.connection.host,
    port: env.database.connection.port,
    user: env.database.connection.user,
    password: env.database.connection.password,
    database: env.database.connection.database,
  },
  pool: { min: 2, max: 10 },
};
