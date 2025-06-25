import { ChannelModel } from "amqplib";

export interface IRabbitMQAdapter {
  sendToQueue(queue: string, message: string): Promise<void>;
  consume(queue: string, callback: (msg: string) => void): Promise<void>;
  close(): Promise<void>;
  getConnection(): ChannelModel | null;
}
