import { IQueue } from "@/infra";

export interface IQueueFactory {
  createEmailQueue(): IQueue;
}
