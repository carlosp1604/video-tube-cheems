import { sanitize } from 'sanitizer'
import { CreateReportApiRequestDto } from '~/modules/Reports/Infrastructure/Api/CreateReportApiRequestDto'

export class CreateReportApiRequestSanitizer {
  public static sanitize (request: CreateReportApiRequestDto): CreateReportApiRequestDto {
    const content = sanitize(request.content)

    return {
      ...request,
      content,
    }
  }
}
