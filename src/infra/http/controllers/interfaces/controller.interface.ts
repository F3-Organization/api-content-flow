import { IResponse } from "@/infra/adapters/express/interfaces/express-adapter.interface";

export interface IController {
    execute(req: any): Promise<IResponse>
}