import { CreatePostCommentApiRequestDto } from './Dtos/CreatePostCommentApiRequestDto'
import { CreatePostCommentRequestDto } from '../Application/Dtos/CreatePostCommentRequestDto'

export class CreatePostRequestDtoTranslator {
  public static fromApiDto(request: CreatePostCommentApiRequestDto): CreatePostCommentRequestDto {
    return {
      postId: request.postId,
      userId: request.userId,
      parentCommentId: request.parentCommentId,
      comment: request.comment
    }
  }
}