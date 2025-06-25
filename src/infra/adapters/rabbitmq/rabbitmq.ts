import amqp, { Channel, ChannelModel } from "amqplib";
import { IRabbitMQ } from "./interfaces/rabbitmq.interface";

export class RabbitMQ implements IRabbitMQ {
  constructor(private readonly url: string) {}

  async connect(): Promise<{ connection: ChannelModel; channel: Channel }> {
    const connection = await amqp.connect(this.url);
    const channel = await connection.createChannel();
    return { connection, channel };
  }

  async close(args: {
    connection: ChannelModel;
    channel: Channel;
  }): Promise<void> {
    await args.channel.close();
    await args.connection.close();
  }
}
