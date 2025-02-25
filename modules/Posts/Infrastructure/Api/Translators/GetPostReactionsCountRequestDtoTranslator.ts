
import {
  GetPostReactionsCountApiRequest
} from '~/modules/Posts/Infrastructure/Api/Requests/GetPostReactionsCountApiRequestDto'
import {
  GetPostReactionsCountApplicationRequestDto
} from '~/modules/Posts/Application/GetPostReactionsCount/GetPostReactionsCountApplicationRequestDto'

export class GetPostReactionsCountRequestDtoTranslator {
  public static fromApiDto (request: GetPostReactionsCountApiRequest): GetPostReactionsCountApplicationRequestDto {
    return {
      postId: request.postId,
    }
  }
}
