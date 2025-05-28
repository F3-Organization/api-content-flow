export interface UseCase {
  execute<T>(input: T): Promise<any>;
}
