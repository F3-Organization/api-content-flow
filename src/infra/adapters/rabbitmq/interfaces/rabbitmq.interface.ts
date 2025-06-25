import { Channel, ChannelModel } from "amqplib";

export interface IRabbitMQ {
  connect(): Promise<void>;
  close(args: { connection: ChannelModel; channel: Channel }): Promise<void>;
  getConnection(): ChannelModel | null;
  getChannel(): Channel | null;
}
