import amqp, { Channel, ChannelModel } from "amqplib";
import { IRabbitMQ } from "./interfaces/rabbitmq.interface";
import { env } from "@/config/env";

export class RabbitMQ implements IRabbitMQ {
  private connection: amqp.ChannelModel | null;
  private channel: amqp.Channel | null;
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
    const url = `amqp://${env.messageBroker.user}:${env.messageBroker.pass}@${env.messageBroker.host}:${env.messageBroker.port}/`;
    this.connection = await amqp.connect(url);
    this.channel = await this.connection.createChannel();
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
