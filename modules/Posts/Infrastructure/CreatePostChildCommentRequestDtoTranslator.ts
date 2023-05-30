import { CreatePostChildCommentApiRequestDto } from './Dtos/CreatePostChildCommentApiRequestDto'
import { CreatePostChildCommentRequestDto } from '../Application/Dtos/CreatePostChildCommentRequestDto'

export class CreatePostChildCommentRequestDtoTranslator {
  public static fromApiDto(request: CreatePostChildCommentApiRequestDto): CreatePostChildCommentRequestDto {
    return {
      postId: request.postId,
      userId: request.userId,
      comment: request.comment,
      parentCommentId: request.parentCommentId
    }
  }
}