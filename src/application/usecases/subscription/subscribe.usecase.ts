import { IUseCase } from "../interfaces/usecase.interface";

export class SubscribeUseCase implements IUseCase {
  constructor() {}
  execute(input: any): Promise<any> {
    throw new Error("Method not implemented.");
  }
}
