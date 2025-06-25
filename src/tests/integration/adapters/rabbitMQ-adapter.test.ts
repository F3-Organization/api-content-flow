import { RabbitMQAdapter } from "@/infra";
import {
  setupTestRabbitMq,
  stopTestRabbit,
} from "@/tests/test-utils/setup-test-rabbitMq";

let rabbitmqAdapter: RabbitMQAdapter;
let queueName: string = "testQueue";
beforeAll(async () => {
  await setupTestRabbitMq();
  rabbitmqAdapter = await RabbitMQAdapter.create();
});

describe("RabbitMQ Adapter Integration Tests", () => {
  it("should connect to RabbitMQ successfully", async () => {
    expect(rabbitmqAdapter.getConnection()).toBeTruthy();
  });

  it("should send a message to RabbitMQ successfully", async () => {
    const messagePromise = new Promise((resolve) => {
      rabbitmqAdapter.consume(queueName, (msg) => {
        resolve(msg);
      });
    });
    await rabbitmqAdapter.sendToQueue(queueName, "test");
    const received = await messagePromise;
    console.log(received);
    expect(received).toBe("test");
  });

  it("shoul to close a connection", async () => {
    await expect(rabbitmqAdapter.close()).resolves.not.toThrow();
  });
});
