import { IFactory } from "@/application";
import { IRoute } from "./interfaces/route.interface";
import { CreateExpress } from "@/infra/adapters/express/express";
import { GetPlansController } from "@/infra";

export class PlanRoutes implements IRoute {
  private createGetPlansController: GetPlansController;
  constructor(
    private http: CreateExpress,
    private factory: IFactory,
  ) {
    this.createGetPlansController =
      this.factory.controllerFactory.createGetPlansController();
  }
  async setup(): Promise<void> {
    await this.http.on({
      method: "get",
      url: "/plans",
      controller: async (req: any) => {
        return await this.createGetPlansController.execute(req);
      },
    });
  }
}
