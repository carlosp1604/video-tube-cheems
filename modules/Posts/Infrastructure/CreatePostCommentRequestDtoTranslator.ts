import { CreatePostCommentApiRequestDto } from './Dtos/CreatePostCommentApiRequestDto'
import { CreatePostCommentRequestDto } from '~/modules/Posts/Application/Dtos/CreatePostCommentRequestDto'

export class CreatePostCommentRequestDtoTranslator {
  public static fromApiDto (request: CreatePostCommentApiRequestDto): CreatePostCommentRequestDto {
    return {
      postId: request.postId,
      userId: request.userId,
      comment: request.comment,
    }
  }
}
