import knex, { Knex } from "knex";
import { config } from "./knex-file";
import { IKnexConnection } from "./interfaces/connection.interface";

export class KnexConnection implements IKnexConnection {
  knexInstance: Knex;
  static instance: KnexConnection;
  constructor(readonly config: Knex.Config) {
    this.knexInstance = knex(this.config);
  }

  async transaction<T>(
    callback: (trx: Knex.Transaction) => Promise<T>
  ): Promise<T> {
    return this.knexInstance.transaction<T>(callback);
  }

  static getInstance(): KnexConnection {
    if (!KnexConnection.instance) {
      KnexConnection.instance = new KnexConnection(config);
    }
    return KnexConnection.instance;
  }
}
