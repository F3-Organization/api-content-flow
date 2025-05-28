export interface UseCase {
  execute<T, R>(input: T): Promise<R>;
}
