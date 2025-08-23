import { IAIService } from "@/infra/services/ai/interfaces/ai-service.interface";
import { IAdaptersFactory } from "@/application";
import { Content } from "@/domain/entities/content.entity";
import { IAiGenerationAdapter } from "@/infra";

export class GeminiService implements IAIService {
  private geminiAdapter: IAiGenerationAdapter;
  constructor(private adapterFactory: IAdaptersFactory) {
    this.geminiAdapter = this.adapterFactory.createGeminiAdapter();
  }

  async generateContent(input: Content): Promise<string> {
    const prompt: string = this.generatePrompt(input);
    return await this.geminiAdapter.generate(prompt);
  }

  private generatePrompt(input: Content): string {
    return `Generate a ${input.format} about ${input.topic} with the title ${input.title}. The content body is: ${input.body}`;
  }
}
