import { IRoute } from "@/infra/http/routes/interfaces/route.interface";
import {
  ContentFormatController,
  CreateExpress,
  GenerateContentController,
  IResponse,
} from "@/infra";
import { IFactory } from "@/application";

export class ContentRoutes implements IRoute {
  private contentFormatController: ContentFormatController;
  private generateContentController: GenerateContentController;
  constructor(
    private http: CreateExpress,
    private factory: IFactory,
  ) {
    this.contentFormatController =
      this.factory.controllerFactory.createContentFormatController();
    this.generateContentController =
      this.factory.controllerFactory.createGenerateContentController();
    this.setup();
  }
  async setup(): Promise<void> {
    await this.http.on({
      method: "get",
      url: "/content-format",
      controller: async (req: any): Promise<IResponse> => {
        return await this.contentFormatController.execute(req);
      },
    });

    await this.http.on({
      method: "post",
      url: "/generate-content",
      controller: async (req: any): Promise<IResponse> => {
        return await this.generateContentController.execute(req);
      },
    });
  }
}
