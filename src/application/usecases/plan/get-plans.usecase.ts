import { IRepositoryFactory } from "@/application/factories";
import { IUseCase } from "../interfaces/usecase.interface";
import { IPlanRepository } from "@/application/repositories/plan-repository.interface";
import { PlanDTO } from "@/application";

export default class GetPlansUseCase implements IUseCase {
  private planRepository: IPlanRepository;
  constructor(private repositoryFactory: IRepositoryFactory) {
    this.planRepository = this.repositoryFactory.createPlanRepository();
  }
  async execute(): Promise<PlanDTO[]> {
    const output = await this.planRepository.getPlans();
    const dto = output.map((plan) => new PlanDTO(plan));
    return dto;
  }
}
