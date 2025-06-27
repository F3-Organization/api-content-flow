import { IFactory } from "@/application";
import { EmailWorker } from "./email-worker";

export class Workers {
  private emailWorker: EmailWorker;
  constructor(private factory: IFactory) {
    this.emailWorker = new EmailWorker(this.factory.adapterFactory);
  }
  async start() {
    await this.emailWorker.processTask();
  }
}
