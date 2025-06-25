import { env } from "@/config/env";
import { GenericContainer, StartedTestContainer } from "testcontainers";

let container: StartedTestContainer;
export async function setupTestRabbitMq() {
  container = await new GenericContainer("rabbitmq:latest")
    .withEnvironment({
      RABBITMQ_DEFAULT_USER: env.messageBroker.user!,
      RABBITMQ_DEFAULT_PASS: env.messageBroker.pass!,
    })
    .withExposedPorts(Number(env.messageBroker.port))
    .start();

  env.messageBroker.host = container.getHost();
  env.messageBroker.port = container.getMappedPort(
    Number(env.messageBroker.port),
  );
}

export async function stopTestRabbit() {
  await container.stop();
}
