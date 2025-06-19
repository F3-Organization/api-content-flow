import { IRoute } from "./interfaces/route.interface";
import { IFactory } from "@/application";
import {
  CreateExpress,
  authenticationMiddleware,
  CreateSubscriptionController,
} from "@/infra";

export class SubscriptionRoutes implements IRoute {
  private createSubscriptionController: CreateSubscriptionController;
  constructor(
    private http: CreateExpress,
    private factory: IFactory,
  ) {
    this.createSubscriptionController =
      this.factory.controllerFactory.createCreateSubscriptionController();
    this.setup();
  }
  async setup(): Promise<void> {
    await this.http.on({
      method: "post",
      url: "/subscriptions",
      controller: async (req: any) => {
        return await this.createSubscriptionController.execute(req);
      },
      middlewares: [authenticationMiddleware],
    });
  }
}
