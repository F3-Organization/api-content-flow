import { IRoute } from "./interfaces/route.interface";
import { IFactory } from "@/application";
import {
  CreateExpress,
  authenticationMiddleware,
  CreateSubscriptionController,
  CreateCheckoutSessionController,
} from "@/infra";

export class SubscriptionRoutes implements IRoute {
  private createSubscriptionController: CreateSubscriptionController;
  private createCheckoutSessionController: CreateCheckoutSessionController;
  constructor(
    private http: CreateExpress,
    private factory: IFactory,
  ) {
    this.createSubscriptionController =
      this.factory.controllerFactory.createCreateSubscriptionController();
    this.createCheckoutSessionController =
      this.factory.controllerFactory.createCreateCheckoutSessionController();
    this.setup();
  }
  async setup(): Promise<void> {
    await this.http.on({
      method: "post",
      url: "/create-checkout-session",
      controller: async (req: any) =>
        await this.createCheckoutSessionController.execute(req),
      middlewares: [authenticationMiddleware],
    });
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
