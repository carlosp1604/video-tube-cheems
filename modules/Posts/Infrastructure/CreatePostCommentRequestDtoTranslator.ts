import { CreatePostCommentApiRequestDto } from './Dtos/CreatePostCommentApiRequestDto'
import { CreatePostCommentApplicationRequestDto } from '~/modules/Posts/Application/CreatePostComment/CreatePostCommentApplicationRequestDto'

export class CreatePostCommentRequestDtoTranslator {
  public static fromApiDto (request: CreatePostCommentApiRequestDto): CreatePostCommentApplicationRequestDto {
    return {
      postId: request.postId,
      userId: request.userId,
      comment: request.comment,
    }
  }
}
