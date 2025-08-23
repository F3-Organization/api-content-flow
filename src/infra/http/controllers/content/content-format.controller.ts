import { IUseCase } from "@/application";
import { IResponse } from "@/infra";
import { ContentFormat } from "@/domain/entities/content.entity";
import { HttpStatus } from "@/infra/http/protocols.enum";

export class ContentFormatController implements IUseCase {
  async execute(input: any): Promise<IResponse> {
    return {
      success: true,
      data: ContentFormat,
      statusCode: HttpStatus.OK,
    };
  }
}
