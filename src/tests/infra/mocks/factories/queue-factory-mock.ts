import { IQueueFactory } from "@/application";

export const mockQueueFactory: IQueueFactory = {
  createEmailQueue: jest.fn().mockReturnValue({
    enqueue: jest.fn().mockResolvedValue(undefined),
  }),
};
