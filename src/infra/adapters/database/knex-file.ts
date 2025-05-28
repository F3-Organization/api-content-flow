import { Knex, knex } from "knex";
import { env } from "@/config/env";

export const config: Knex.Config = {
  client: env.client,
  connection: {
    host: env.connection.host,
    port: env.connection.port,
    user: env.connection.user,
    password: env.connection.password,
    database: env.connection.database,
  },
  pool: { min: 2, max: 10 },
};