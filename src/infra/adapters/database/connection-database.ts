import knex from "knex";
import {
  IConnectionDatabase,
  insertType,
  queryType,
  rawType,
} from "./interfaces/connection-database.interface";

export class ConnectionDatabase implements IConnectionDatabase {
  constructor(private readonly connection: knex.Knex) {}

  async transaction<T>(
    callback: (trx: knex.Knex.Transaction) => Promise<T>
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
        for (const [column, direction] of Object.entries(params.orderBy)) {
          query = query.orderBy(column, direction);
        }
      }
      if (params.offset) {
        query = query.offset(params.offset);
      }
      if (params.limit) {
        query = query.limit(params.limit);
      }
      return query;
    });
  }

  async raw<T = any>(params: rawType): Promise<T[]> {
    return this.transaction<T[]>(async (trx) => {
      const result = await trx.raw(params.sql, params.params);
      return result;
    });
  }

  async insert<T = any>(params: insertType): Promise<T> {
    return this.transaction<T>(async (trx) => {
      const [result] = await trx(params.table).insert(params.data);
      return result as T;
    });
  }
}
