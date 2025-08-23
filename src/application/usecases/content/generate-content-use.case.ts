import {
  IContentRepository,
  IRepositoryFactory,
  IServiceFactory,
  IUseCase,
} from "@/application";
import { IAIService } from "@/infra/services";
import { Content, ContentFormat } from "@/domain/entities/content.entity";
import { v7 as uuidV7 } from "uuid";
import Input = generateContent.Input;

export namespace generateContent {
  export interface Input {
    title: string;
    topic: string;
    body: string;
    userId: string;
    format: ContentFormat;
  }
}
/**
 * Alterar caso de uso para receber uma string
 *
 * @param string Deve ser passsada como argumento para o generate content
 * @generateContent O metodo generate content do geminiService deve retornar um object com as propriedade para instanciar Content
 * Consecutivamente, com Content instanciado, deve-se salvar no banco de dados e retornar para o controller os dados.
 * @return ContentDTO
 * */
export class GenerateContentUseCase implements IUseCase {
  private contentRepository: IContentRepository;
  private geminiService: IAIService;
  constructor(
    private repositoryFactory: IRepositoryFactory,
    private serviceFactory: IServiceFactory,
  ) {
    this.contentRepository = this.repositoryFactory.createContentRepository();
    this.geminiService = this.serviceFactory.createGeminiService();
  }
  async execute(input: Input): Promise<string> {
    const entry = this.buildEntry(input);
    await this.contentRepository.save(entry);
    return await this.geminiService.generateContent(entry);
  }

  private buildEntry(input: Input): Content {
    return new Content({
      id: uuidV7(),
      userId: input.userId,
      title: input.title,
      topic: input.topic,
      body: input.body,
      format: input.format,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}
