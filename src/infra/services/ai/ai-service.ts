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
    const prompt = `
      <body>
        <h1>${input.title}</h1>
        <h2>${input.topic}</h2>
        <p>${input.body}</p>
      </body>
    `;
    return await this.geminiAdapter.generate(prompt);
  }
}
