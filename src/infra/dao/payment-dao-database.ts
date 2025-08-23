import { IPaymentDAO } from "@/application";
import { Models, Table } from "@/infra";
import { IConnectionDatabase } from "@/infra";

export class PaymentDAO implements IPaymentDAO {
  constructor(private connection: IConnectionDatabase) {}

  async save(input: Models.Payment): Promise<void> {
    await this.connection.insert({
      table: Table.Payment,
      data: input,
    });
  }

  async update(input: Models.Payment): Promise<void> {
    await this.connection.update({
      table: Table.Payment,
      where: { id: input.id },
      data: input,
    });
  }
}
