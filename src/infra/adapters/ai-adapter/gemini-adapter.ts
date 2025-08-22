import { IAiGenerationAdapter } from "@/infra/adapters/ai-adapter/interfaces";
import { GoogleGenAI } from "@google/genai";
import { env } from "@/config/env";
import { DomainException } from "@/domain/error";
import { HttpStatus } from "@/infra/http/protocols.enum";

export class GeminiAdapter implements IAiGenerationAdapter {
  private gemini: GoogleGenAI;

  constructor() {
    this.gemini = new GoogleGenAI({ apiKey: env.gemini.apiKey });
  }

  async generate(prompt: string): Promise<string> {
    try {
      const response = await this.gemini.models.generateContentStream({
        model: "gemini-preview",
        contents: prompt,
        config: {
          responseSchema: {
            type: Object,
          },
        }, // Add more configuration options as needed
      });
      let text = "";
      for await (const chunk of response) {
        text += chunk.text;
      }
      return text;
    } catch (err) {
      const error = err as Error;
      throw new DomainException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
