import { env } from "@/config/env";
import { NodemailerAdapter } from "../adapters/nodemailer/nodemailer-adapter";
import { RabbitMQAdapter } from "../adapters/rabbitmq/rabbitmq-adapter";

const rabbitMQ = new RabbitMQAdapter(process.env.RABBITMQ_URL!);
const nodemailerAdapter = new NodemailerAdapter({
  host: env.messageBroker.host,
  port: Number(env.messageBroker.port),
  auth: {
    user: env.messageBroker.user,
    pass: env.messageBroker.pass,
  },
});

async function startEmailWorker() {
  await rabbitMQ.init();
  await rabbitMQ.consume("email_queue", async (msg: string) => {
    const email = JSON.parse(msg);
    nodemailerAdapter.sendMail(email);
  });
}

startEmailWorker();