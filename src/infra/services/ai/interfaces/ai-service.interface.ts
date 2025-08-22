import { Content } from "@/domain/entities/content.entity";

export interface IAIService {
  generateContent(input: Content): Promise<string>;
}
