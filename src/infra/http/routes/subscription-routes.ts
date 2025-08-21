import { IRoute } from "./interfaces/route.interface";
import { IFactory } from "@/application";
import {
  CreateExpress,
  authenticationMiddleware,
  CreateSubscriptionController,
  CreateCheckoutSessionController,
  CancelSubscriptionController,
  IResponse,
} from "@/infra";

export class SubscriptionRoutes implements IRoute {
  private createSubscriptionController: CreateSubscriptionController;
  private createCheckoutSessionController: CreateCheckoutSessionController;
  private cancelSubscriptionController: CancelSubscriptionController;
  constructor(
    private http: CreateExpress,
    private factory: IFactory,
  ) {
    this.createSubscriptionController =
      this.factory.controllerFactory.createCreateSubscriptionController();
    this.createCheckoutSessionController =
      this.factory.controllerFactory.createCreateCheckoutSessionController();
    this.cancelSubscriptionController =
      this.factory.controllerFactory.createCancelSubscriptionController();
    this.setup();
  }
  async setup(): Promise<void> {
    await this.http.on({
      method: "post",
      url: "/create-checkout-session",
      controller: async (req: any): Promise<IResponse> =>
        await this.createCheckoutSessionController.execute(req),
      middlewares: [authenticationMiddleware],
    });
    await this.http.on({
      method: "post",
      url: "/create-subscription",
      controller: async (req: any): Promise<IResponse> => {
        return await this.createSubscriptionController.execute(req);
      },
      middlewares: [authenticationMiddleware],
    });
    await this.http.on({
      method: "patch",
      url: "/cancel-subscription",
      controller: async (req: any): Promise<IResponse> => {
        return await this.cancelSubscriptionController.execute(req);
      },
      middlewares: [authenticationMiddleware],
    });
  }
}
