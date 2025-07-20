import { Models } from "@/infra";

export interface IPaymentDAO {
  save(input: Models.Payment): Promise<void>;
  update(input: Models.Payment): Promise<void>;
}
