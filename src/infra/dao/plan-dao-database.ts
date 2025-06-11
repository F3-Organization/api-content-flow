import { IPlanDAO } from "@/application";
import { IConnectionDatabase } from "../adapters/database/interfaces/connection-database.interface";
import { Models, Table } from "../models";

export class PlanDAO implements IPlanDAO {
    constructor(private connection: IConnectionDatabase) {}
    async getAll(): Promise<Models.Plan[]> {
        const data = await this.connection.query({
            table: Table.Plan,
            where: {},
        })
        return data as Models.Plan[];
    }
}