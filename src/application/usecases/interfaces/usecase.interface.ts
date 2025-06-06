export interface IUseCase {
  execute(input: any): Promise<any>;
}
