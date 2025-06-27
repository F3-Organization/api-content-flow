import { IQueue } from "@/infra";

export interface IQueueFactory {
  emailQueue(): IQueue;
}
