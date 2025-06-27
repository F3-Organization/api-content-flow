import { sendMailInput } from "@/infra";

export interface IQueue {
  enqueue(input: sendMailInput): Promise<void>;
}
