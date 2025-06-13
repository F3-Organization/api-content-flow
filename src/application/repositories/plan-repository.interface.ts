import { Plan } from "@/domain/entities/plan.entity";

export interface IPlanRepository {
    getPlans(): Promise<Plan[]>;
}