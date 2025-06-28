import { IAdaptersFactory } from "@/application";
import { IRabbitMQAdapter, sendMailInput } from "@/infra";
import { IQueue } from "./interfaces/email-queue.interface";
import { env } from "@/config/env";

export class EmailQueue implements IQueue {
  private rabbitMQAdapter: Promise<IRabbitMQAdapter>;
  private queueName = env.queue_names.email!;
  constructor(private adapterFactory: IAdaptersFactory) {
    this.rabbitMQAdapter = this.adapterFactory.createRabbitMqAdapter();
  }

  async enqueue(input: sendMailInput): Promise<void> {
    const adapter = await this.rabbitMQAdapter;
    await adapter.sendToQueue(this.queueName, this.formatToQueue(input));
  }

  private formatToQueue(input: sendMailInput) {
    return JSON.stringify({ ...input });
  }
}
