import { Knex } from "knex";

export interface IKnexConnection {
  transaction<T>(callback: (trx: Knex.Transaction) => Promise<T>): Promise<T>;
}
