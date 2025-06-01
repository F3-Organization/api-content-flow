export interface IUseCase {
  execute(req: any): Promise<any>;
}
