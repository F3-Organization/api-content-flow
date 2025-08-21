import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import {
  Application,
  IRouterMatcher,
  Router,
  Request,
  Response,
} from "express";
import { ExpressAdapterNamespace, IExpressAdapter, IResponse } from "@/infra";
import { DomainException } from "@/domain/error";
import { HttpStatus } from "@/infra/http/protocols.enum";
import redoc from "redoc-express";

export class ExpressAdapter implements IExpressAdapter {
  private app: Application;
  private readonly routes: Router;
  constructor(app: Application) {
    this.app = app;
    this.routes = Router();
    this.setBaseRoute();
    this.setDocsRoute();
  }

  async handlerRequest(
    method: ExpressAdapterNamespace.method,
    url: ExpressAdapterNamespace.url,
    controller: ExpressAdapterNamespace.controller,
    middlewares?: ExpressAdapterNamespace.middleware[],
  ): Promise<void> {
    const routerMethod = this.methodsMapper(method);

    const expressHandler = async (req: Request, res: Response) => {
      try {
        const result = await controller(req);
        this.handleControllerResponse(result, res);
      } catch (err) {
        const error = err as DomainException;
        this.expressHandlerError(error, res);
      }
    };

    if (middlewares) routerMethod(url, ...middlewares, expressHandler);
    else routerMethod(url, expressHandler);
  }

  private expressHandlerError(error: DomainException | any, res: any) {
    res.status(error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }

  async middlewareHandler(
    middleware: ExpressAdapterNamespace.middleware,
  ): Promise<void> {
    this.app.use(middleware);
  }

  private handleControllerResponse(result: IResponse, res: Response): void {
    const {
      statusCode = HttpStatus.OK,
      data,
      message,
      success = true,
      error,
    } = result;

    const response: any = { success };

    if (message) response.message = message;
    if (data !== undefined) response.data = data;
    if (error) {
      response.success = false;
      response.error = error;
    }

    if (result.cookies) {
      for (const [key, value] of Object.entries(result.cookies)) {
        res.cookie(key, value, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });
      }
    }

    res.status(statusCode).json(response);
  }

  private methodsMapper(
    method: ExpressAdapterNamespace.method,
  ): IRouterMatcher<any> {
    const methods = {
      get: this.routes.get.bind(this.routes),
      post: this.routes.post.bind(this.routes),
      put: this.routes.put.bind(this.routes),
      delete: this.routes.delete.bind(this.routes),
      patch: this.routes.patch.bind(this.routes),
      options: this.routes.options.bind(this.routes),
      head: this.routes.head.bind(this.routes),
    };

    const routerMethod = methods[method as keyof typeof methods];

    if (!routerMethod) {
      throw new Error(`Unsupported HTTP method: ${method}`);
    }

    return routerMethod;
  }

  private setBaseRoute() {
    this.app.use("/api", this.routes);
  }

  private setDocsRoute() {
    const specPath: string = path.join(
      __dirname,
      "../../../../swagger-bundled.yaml",
    );
    const swaggerDocument = YAML.load(specPath);
    this.app.get("/api/swagger-bundled.yaml", (req: any, res: any): void => {
      res.sendFile(specPath);
    });
    this.app.use(
      "/api/swagger",
      swaggerUi.serve,
      swaggerUi.setup(swaggerDocument),
    );
    this.app.use(
      "/api/redoc",
      redoc({
        title: "Redoc",
        specUrl: "/api/swagger-bundled.yaml",
      }),
    );
  }
}
