import { Models } from "@/infra/models/tables";

export interface IAuthDAO {
  update(input: any): Promise<void>;
  getByUserId(id: string): Promise<Models.Authentication>;
}
