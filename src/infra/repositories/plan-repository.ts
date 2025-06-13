import { IPlanRepository } from "@/application";
import { Plan } from "@/domain/entities";
import { IConnectionDatabase } from "../adapters/database/interfaces/connection-database.interface";
import { PlanDAO } from "../dao/plan-dao-database";
import { Models } from "../models";

export class PlanRepository implements IPlanRepository {
  private planDAO: PlanDAO;
  constructor(private connection: IConnectionDatabase) {
    this.planDAO = new PlanDAO(this.connection);
  }
  async getPlans(): Promise<Plan[]> {
    const data = await this.planDAO.getAll();
    const output = Promise.all(data.map((p) => this.buildEntry(p)));
    return output
  }

  private buildEntry(entity: Models.Plan) {
    return new Plan({
      id: entity.id,
      name: entity.name,
      price: entity.price,
      description: entity.description,
      features: entity.features,
      createdAt: entity.created_at,
      updatedAt: entity.updated_at,
    });
  }
}
