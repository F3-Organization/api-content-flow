import { Application, IRouterMatcher } from "express";
import {
  ExpressAdapterNamespace,
  IExpressAdapter,
  IResponse,
} from "./interfaces/express-adapter-interface";

export class ExpressAdapter implements IExpressAdapter {
  private app: Application;
  constructor(app: Application) {
    this.app = app;
  }

  async handlerRequest(
    method: ExpressAdapterNamespace.method,
    url: ExpressAdapterNamespace.url,
    controller: ExpressAdapterNamespace.controller,
    middlewares?: ExpressAdapterNamespace.middleware[]
  ): Promise<void> {
    const routerMethod = this.methodsMapper(method);

    const expressHandler = async (req: any, res: any) => {
      try {
        const result = await controller(req);
        this.handleControllerResponse(result, res);
      } catch (err) {
        const error = err;
        this.expressHandlerError(err, res);
      }
    };

    if (middlewares) routerMethod(url, ...middlewares, expressHandler);
    else routerMethod(url, expressHandler);
  }

  private expressHandlerError(error: any, res: any) {
    res
      .status(error.status || 500)
      .json({ message: error.message || "Internal Server Error" });
  }

  async middlewareHandler(
    middleware: ExpressAdapterNamespace.middleware
  ): Promise<void> {
    this.app.use(middleware);
  }

  private handleControllerResponse(result: IResponse, res: any): void {
    const { statusCode = 200, data, message, success = true, error } = result;

    const response: any = { success };

    if (message) response.message = message;
    if (data !== undefined) response.data = data;
    if (error) {
      response.success = false;
      response.error = error;
    }

    res.status(statusCode).json(response);
  }

  private methodsMapper(
    method: ExpressAdapterNamespace.method
  ): IRouterMatcher<any> {
    const methods = {
      get: this.app.get.bind(this.app),
      post: this.app.post.bind(this.app),
      put: this.app.put.bind(this.app),
      delete: this.app.delete.bind(this.app),
      patch: this.app.patch.bind(this.app),
      options: this.app.options.bind(this.app),
      head: this.app.head.bind(this.app),
    };

    const routerMethod = methods[method as keyof typeof methods];

    if (!routerMethod) {
      throw new Error(`Unsupported HTTP method: ${method}`);
    }

    return routerMethod;
  }
}
