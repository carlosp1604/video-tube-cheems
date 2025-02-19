import { CreateReportApiRequestDto } from '~/modules/Reports/Infrastructure/Api/CreateReportApiRequestDto'
import { CreateReportApplicationRequestDto } from '~/modules/Reports/Application/CreateReportApplicationRequestDto'

export class CreateReportRequestDtoTranslator {
  public static fromApiDto (apiDto: CreateReportApiRequestDto, userId: string): CreateReportApplicationRequestDto {
    return {
      content: apiDto.content,
      postId: apiDto.postId,
      userId,
    }
  }
}
