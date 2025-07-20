import { IPaymentRepository } from "@/application";
import { Payment } from "@/domain/entities/payment.entity";
import { IConnectionDatabase } from "../adapters";
import { PaymentDAO } from "../dao";
import { Models } from "../models";

export class PaymentRepository implements IPaymentRepository {
  private paymentDAO: PaymentDAO;
  constructor(private connection: IConnectionDatabase) {
    this.paymentDAO = new PaymentDAO(this.connection);
  }

  async save(payment: Payment): Promise<void> {
    const input = this.formatToDatabase(payment);
    await this.paymentDAO.save(input);
  }

  async update(payment: Payment): Promise<void> {
    const input = this.formatToDatabase(payment);
    await this.paymentDAO.update(input);
  }

  private formatToDatabase(input: Payment): Models.Payment {
    return {
      id: input.id,
      user_id: input.user_id,
      plan_id: input.plan_id,
      subscription_id: input.subscription_id!,
      amount: input.amount,
      status: input.status,
      method: input.method,
      created_at: input.created_at,
      updated_at: input.updated_at,
      paid_at: input.paid_at,
      error_message: input.error_message,
    };
  }
}
