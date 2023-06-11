import { sanitize } from 'sanitizer'
import {
  CreatePostChildCommentApiRequestDto
} from '~/modules/Posts/Infrastructure/Dtos/CreatePostChildCommentApiRequestDto'

export class CreatePostChildCommentRequestSanitizer {
  public static sanitize (request: CreatePostChildCommentApiRequestDto): CreatePostChildCommentApiRequestDto {
    const comment = sanitize(request.comment)

    return {
      ...request,
      comment,
    }
  }
}
