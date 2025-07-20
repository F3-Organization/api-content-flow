import { Payment } from "@/domain/entities/payment.entity";

export interface IPaymentRepository {
  save(payment: Payment): Promise<void>;
  update(payment: Payment): Promise<void>;
}
