import { Plan } from "@/domain/entities";

export class PlanDTO {
  id: string;
  name: string;
  price: number;
  trialDays: number;
  description: string;
  features: Object;
  createdAt: Date;
  updatedAt: Date;
  constructor(entity: Plan) {
    this.id = entity.getId;
    this.name = entity.getName;
    this.price = entity.getPrice;
    this.trialDays = entity.getTrialDays;
    this.description = entity.getDescription;
    this.features = entity.getFeatures;
    this.createdAt = entity.getCreatedAt;
    this.updatedAt = entity.getUpdatedAt;
  }
}
