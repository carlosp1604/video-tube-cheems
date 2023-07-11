import { CreatePostChildCommentApiRequestDto } from './Dtos/CreatePostChildCommentApiRequestDto'
import {
  CreatePostChildCommentApplicationRequestDto
} from '~/modules/Posts/Application/CreatePostChildComment/CreatePostChildCommentApplicationRequestDto'

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
