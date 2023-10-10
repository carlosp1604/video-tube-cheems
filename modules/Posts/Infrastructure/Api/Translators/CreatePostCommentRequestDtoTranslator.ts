import { CreatePostCommentApplicationRequestDto } from '~/modules/Posts/Application/CreatePostComment/CreatePostCommentApplicationRequestDto'
import { CreatePostCommentApiRequestDto } from '~/modules/Posts/Infrastructure/Api/Requests/CreatePostCommentApiRequestDto'

export class CreatePostCommentRequestDtoTranslator {
  public static fromApiDto (request: CreatePostCommentApiRequestDto): CreatePostCommentApplicationRequestDto {
    return {
      postId: request.postId,
      userId: request.userId,
      comment: request.comment,
    }
  }
}
