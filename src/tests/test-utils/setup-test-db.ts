import { env } from "@/config/env";
import { GenericContainer, StartedTestContainer } from "testcontainers";
import path from "path";
import fs from "fs/promises";
import { ConnectionDatabase } from "@/infra/adapters/database/connection-database";
import { KnexConnection } from "@/infra/adapters/database/connection";

let container: StartedTestContainer;
let knexConnection: KnexConnection;
export let connection: ConnectionDatabase;

export async function startTestDB() {
  container = await new GenericContainer("postgres")
    .withEnvironment({
      POSTGRES_PASSWORD: "test",
      POSTGRES_DB: "testdb",
    })
    .withExposedPorts(5432)
    .start();

  const config = {
    client: env.database.client,
    connection: {
      host: container.getHost(),
      port: container.getMappedPort(5432),
      user: "postgres",
      password: "test",
      database: "testdb",
    },
  };

  knexConnection = new KnexConnection(config);
  connection = new ConnectionDatabase(knexConnection.knexInstance);
  const ddlPath = path.resolve(__dirname, "../../../docs/database/DDL.sql");
  const sql = await fs.readFile(ddlPath, "utf-8");
  try {
    await connection.raw({ sql: sql });
  } catch (error) {
    console.error("Error executing SQL:", error);
  }

  return connection;
}

export async function stopTestDB() {
  await knexConnection.knexInstance.destroy();
  await container.stop();
}
