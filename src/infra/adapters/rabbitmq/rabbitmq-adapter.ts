import { Channel, ChannelModel } from "amqplib";
import { IRabbitMQAdapter } from "./interfaces/rabbbitmq-adapter.interface";
import { IRabbitMQ } from "./interfaces/rabbitmq.interface";
import { RabbitMQ } from "./rabbitmq";

export class RabbitMQAdapter implements IRabbitMQAdapter {
  private rabbitMQ: IRabbitMQ;
  private connection: ChannelModel | null;
  private channel: Channel | null;
  constructor() {
    this.rabbitMQ = new RabbitMQ(process.env.RABBITMQ_URL!);
    this.connection = null;
    this.channel = null;
    this.init();
  }

  async init(): Promise<void> {
    const { connection, channel } = await this.rabbitMQ.connect();
    this.connection = connection;
    this.channel = channel;
  }

  async sendToQueue(queue: string, message: string): Promise<void> {
    await this.channel!.assertQueue(queue, { durable: true });
    await this.channel!.sendToQueue(queue, Buffer.from(message));
  }

  async consume(queue: string, callback: (msg: string) => void): Promise<void> {
    await this.channel?.consume(queue, (msg) => {
      if (msg !== null) {
        callback(msg.content.toString());
        this.channel?.ack(msg);
      }
    });
  }

  async close(): Promise<void> {
    await this.connection?.close();
  }
}
