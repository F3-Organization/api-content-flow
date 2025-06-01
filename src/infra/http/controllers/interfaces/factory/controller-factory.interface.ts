import { CreateUserController } from "../../create-user-controller";

export interface IControllerFactory {
    createCreateUSerController(): CreateUserController
}