import {
  CreatePostChildCommentApplicationRequestDto
} from '~/modules/Posts/Application/CreatePostChildComment/CreatePostChildCommentApplicationRequestDto'
import {
  CreatePostChildCommentApiRequestDto
} from '~/modules/Posts/Infrastructure/Api/Requests/CreatePostChildCommentApiRequestDto'

export class CreatePostChildCommentRequestDtoTranslator {
  public static fromApiDto (request: CreatePostChildCommentApiRequestDto): CreatePostChildCommentApplicationRequestDto {
    return {
      postId: request.postId,
      userId: request.userId,
      comment: request.comment,
      parentCommentId: request.parentCommentId,
    }
  }
}
