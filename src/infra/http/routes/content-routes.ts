import { IRoute } from "@/infra/http/routes/interfaces/route.interface";
import { CreateExpress, IControllerFactory } from "@/infra";
import { ContentFormatController } from "@/infra/http/controllers/content/content-format.controller";
import { IFactory } from "@/application";

export class ContentRoutes implements IRoute {
  private contentFormatController: ContentFormatController;
  constructor(
    private http: CreateExpress,
    private factory: IFactory,
  ) {
    this.contentFormatController =
      this.factory.controllerFactory.createContentFormatController();
    this.setup();
  }
  async setup(): Promise<void> {
    await this.http.on({
      method: "get",
      url: "/content-format",
      controller: async (req: any) => {
        return await this.contentFormatController.execute(req);
      },
    });
  }
}
