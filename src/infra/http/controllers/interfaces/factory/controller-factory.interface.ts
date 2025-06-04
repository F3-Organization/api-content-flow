import { CreateUserController } from "../../create-user-controller";
import { LoginController } from "../../login-controller";

export interface IControllerFactory {
  createCreateUSerController(): CreateUserController;
  createLoginController(): LoginController;
}
