import { IAdaptersFactory } from "@/application";
import { IWorker } from "./interfaces/worker.interface";
import { INodemailerAdapter, IRabbitMQAdapter } from "@/infra";
import { env } from "@/config/env";

export class EmailWorker implements IWorker {
  private rabbitMqAdapter: Promise<IRabbitMQAdapter>;
  private nodemailerAdapter: INodemailerAdapter;
  private queueName = env.queue_names.email!;
  constructor(private adapterFactory: IAdaptersFactory) {
    this.rabbitMqAdapter = this.adapterFactory.createRabbitMqAdapter();
    this.nodemailerAdapter = this.adapterFactory.createNodemailerAdapter();
  }

  async processTask(): Promise<void> {
    const adapter = await this.rabbitMqAdapter;
    await adapter.consume(this.queueName, (msg: any) => {
      const input = JSON.parse(msg);
      this.nodemailerAdapter.sendMail({
        ...input,
      });
    });
  }
}
