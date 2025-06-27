export interface IWorker {
  processTask(): Promise<void>;
}
