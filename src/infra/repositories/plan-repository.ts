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
    return output;
  }

  private buildEntry(entity: Models.Plan) {
    return new Plan({
      id: entity.id,
      name: entity.name,
      price: Number(entity.price),
      description: entity.description,
      features: {
        users: entity.features.users,
        metrics: entity.features.metrics,
        support: entity.features.support,
        integrations: entity.features.integrations,
        contentFormats: entity.features.content_formats,
        postsPerMonth: entity.features.posts_per_month,
        editorialCalendar: entity.features.editorial_calendar,
      },
      createdAt: entity.created_at,
      updatedAt: entity.updated_at,
    });
  }
}
