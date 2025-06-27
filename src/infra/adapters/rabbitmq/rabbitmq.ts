import amqp, { Channel, ChannelModel } from "amqplib";
import { IRabbitMQ } from "./interfaces/rabbitmq.interface";
import { env } from "@/config/env";

export class RabbitMQ implements IRabbitMQ {
  private connection: amqp.ChannelModel | null;
  private channel: amqp.Channel | null;
  private url = `amqp://${env.messageBroker.user}:${env.messageBroker.pass}@${env.messageBroker.host}:${env.messageBroker.port}/`;
  private constructor() {
    this.connection = null;
    this.channel = null;
  }

  static async create(): Promise<RabbitMQ> {
    const instance = new RabbitMQ();
    await instance.connect();
    return instance;
  }

  async connect(): Promise<void> {
    let connected = false;
    let attempts = 0;
    const maxAttempts = 5;
    for (attempts = 0; attempts < maxAttempts && !connected; attempts++) {
      try {
        this.connection = await amqp.connect(this.url);
        this.channel = await this.connection.createChannel();
        connected = true;
      } catch (err) {
        attempts++;
        console.error("Failed to connect to RabbitMQ:", err);
        console.log("Retrying connection to RabbitMQ... Attempt: ", attempts);
        await new Promise((res) => setTimeout(res, 2000));
      }
    }
  }

  async close(args: {
    connection: ChannelModel;
    channel: Channel;
  }): Promise<void> {
    await args.channel.close();
    await args.connection.close();
  }

  getConnection(): ChannelModel | null {
    return this.connection;
  }

  getChannel(): Channel | null {
    return this.channel;
  }
}
