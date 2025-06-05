import { NodemailerAdapter } from "../adapters/nodemailer/nodemailer-adapter";
import { RabbitMQAdapter } from "../adapters/rabbitmq/rabbitmq-adapter";

const rabbitMQ = new RabbitMQAdapter(process.env.RABBITMQ_URL!);
const nodemailerAdapter = new NodemailerAdapter({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
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