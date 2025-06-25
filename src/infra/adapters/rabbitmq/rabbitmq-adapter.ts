import { Channel, ChannelModel } from "amqplib";
import { IRabbitMQAdapter } from "./interfaces/rabbbitmq-adapter.interface";
import { IRabbitMQ } from "./interfaces/rabbitmq.interface";
import { RabbitMQ } from "./rabbitmq";

export class RabbitMQAdapter implements IRabbitMQAdapter {
  private rabbitMQ: IRabbitMQ;
  private connection: ChannelModel;
  private channel: Channel;

  private constructor(rabbitMQ: IRabbitMQ) {
    this.rabbitMQ = rabbitMQ;
    this.connection = this.rabbitMQ.getConnection()!;
    this.channel = this.rabbitMQ.getChannel()!;
  }

  static async create(): Promise<RabbitMQAdapter> {
    const rabbitMQ = await RabbitMQ.create();
    return new RabbitMQAdapter(rabbitMQ);
  }

  async sendToQueue(queue: string, message: string): Promise<void> {
    await this.channel.assertQueue(queue, { durable: true });
    await this.channel.sendToQueue(queue, Buffer.from(message));
  }

  async consume(queue: string, callback: (msg: string) => void): Promise<void> {
    await this.channel.assertQueue(queue, { durable: true });
    await this.channel.consume(queue, (msg) => {
      if (msg !== null) {
        callback(msg.content.toString());
        this.channel.ack(msg);
      }
    });
  }

  async close(): Promise<void> {
    await this.rabbitMQ.close({
      connection: this.connection,
      channel: this.channel,
    });
  }

  getConnection(): ChannelModel | null {
    return this.connection;
  }
}
