import knex from "knex";
import {
  deleteType,
  IConnectionDatabase,
  insertType,
  queryType,
  rawType,
  updateType,
} from "@/infra";

export class ConnectionDatabase implements IConnectionDatabase {
  constructor(private readonly connection: knex.Knex) {}

  getInstance(): knex.Knex {
    return this.connection;
  }

  async transaction<T>(
    callback: (trx: knex.Knex.Transaction) => Promise<T>,
  ): Promise<T> {
    return this.connection.transaction<T>(async (trx) => {
      return callback(trx);
    });
  }

  async query<T = any>(params: queryType): Promise<T[]> {
    return this.transaction<T[]>(async (trx) => {
      let query: knex.Knex.QueryBuilder = trx(params.table);

      if (params.where) query = query.where(params.where);
      if (params.whereIn) {
        for (const [column, values] of Object.entries(params.whereIn)) {
          query = query.whereIn(column, values);
        }
      }
      if (params.whereLike) {
        for (const [column, value] of Object.entries(params.whereLike)) {
          query = query.where(column, "like", `%${value}%`);
        }
      }
      if (params.orderBy) {
        for (const order of params.orderBy) {
          query = query.orderBy(order.column, order.direction);
        }
      }
      if (params.offset !== undefined) {
        query = query.offset(params.offset);
      }
      if (params.limit !== undefined) {
        query = query.limit(params.limit);
      }
      return query;
    });
  }

  async raw<T = any>(params: rawType): Promise<T[]> {
    return this.transaction<T[]>(async (trx) => {
      let result;
      if (params.params) result = await trx.raw(params.sql, params.params);
      else result = await trx.raw(params.sql);
      return result as T[];
    });
  }

  async insert<T = any>(params: insertType): Promise<T> {
    return this.transaction<T>(async (trx) => {
      const [result] = await trx(params.table)
        .insert(params.data)
        .returning("*");
      return result as T;
    });
  }

  async update<T = any>(params: updateType<T>): Promise<void> {
    await this.transaction(async (trx) => {
      await trx(params.table).update(params.data).where(params.where);
    });
  }

  async delete(params: deleteType): Promise<void> {
    await this.transaction(async (trx) => {
      await trx(params.table).delete().where(params.where);
    });
  }
}
