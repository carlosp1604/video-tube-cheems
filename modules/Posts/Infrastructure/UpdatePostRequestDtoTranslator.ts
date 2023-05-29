import { UpdatePostCommentApiRequestDto } from './Dtos/UpdatePostCommentApiRequestDto'
import { UpdatePostCommentRequestDto } from '~/modules/Posts/Application/Dtos/UpdatePostCommentRequestDto'

export class UpdatePostRequestDtoTranslator {
  public static fromApiDto (request: UpdatePostCommentApiRequestDto): UpdatePostCommentRequestDto {
    return {
      postCommentId: request.postCommentId,
      postId: request.postId,
      userId: request.userId,
      comment: request.comment,
      postParentId: request.parentCommentId,
    }
  }
}
