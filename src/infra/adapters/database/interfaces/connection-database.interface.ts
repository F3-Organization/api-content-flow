import { Knex } from "knex";

export interface IConnectionDatabase {
  transaction<T>(callback: (trx: Knex.Transaction) => Promise<T>): Promise<T>;
  query<T = any>(params: queryType): Promise<T[]>;
  raw<T = any>(params: rawType): Promise<T[]>;
  insert<T = any>(params: insertType): Promise<T>;
}

export type queryType = {
  table: string;
  where: Record<string, any>;
  whereIn?: Record<string, any[]>;
  whereLike?: Record<string, any>;
  orderBy?: { column: string; direction: 'asc' | 'desc' }[];
  offset?: number;
  limit?: number;
};
export type rawType = { sql: string; params: Record<string, any> };

export type insertType = {
  table: string;
  data: Record<string, any>;
};
