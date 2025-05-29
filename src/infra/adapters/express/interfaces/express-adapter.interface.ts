import { NextFunction, Request, Response } from "express";

export interface IResponse {
  statusCode?: number;
  data?: any;
  message?: string;
  success?: boolean;
  error?: string;
}

export namespace ExpressAdapterNamespace {
  export type method =
    | "get"
    | "post"
    | "put"
    | "delete"
    | "patch"
    | "options"
    | "head";
  export type url = string;
  export type controller = (req: Request) => Promise<IResponse> | IResponse;
  export type middleware = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => any;
}

export interface IExpressAdapter {
  handlerRequest(
    method: ExpressAdapterNamespace.method,
    url: ExpressAdapterNamespace.url,
    controller: ExpressAdapterNamespace.controller,
    middlewares?: ExpressAdapterNamespace.middleware[]
  ): Promise<void>;

  middlewareHandler(
    middleware: ExpressAdapterNamespace.middleware
  ): Promise<void>;
}
