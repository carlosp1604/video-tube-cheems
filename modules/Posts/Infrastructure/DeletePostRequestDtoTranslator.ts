import { DeletePostCommentApiRequestDto } from './Dtos/DeletePostCommentApiRequestDto'
import { DeletePostCommentRequestDto } from '~/modules/Posts/Application/Dtos/DeletePostCommentRequestDto'

export class DeletePostRequestDtoTranslator {
  public static fromApiDto (request: DeletePostCommentApiRequestDto): DeletePostCommentRequestDto {
    return {
      postCommentId: request.postCommentId,
      postId: request.postId,
      userId: request.userId,
      postParentId: request.parentCommentId,
    }
  }
}
