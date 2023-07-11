import { DeletePostCommentApiRequestDto } from './Dtos/DeletePostCommentApiRequestDto'
import { DeletePostCommentApplicationRequestDto } from '~/modules/Posts/Application/DeletePostComment/DeletePostCommentApplicationRequestDto'

export class DeletePostRequestDtoTranslator {
  public static fromApiDto (request: DeletePostCommentApiRequestDto): DeletePostCommentApplicationRequestDto {
    return {
      postCommentId: request.postCommentId,
      postId: request.postId,
      userId: request.userId,
      parentCommentId: request.parentCommentId,
    }
  }
}
