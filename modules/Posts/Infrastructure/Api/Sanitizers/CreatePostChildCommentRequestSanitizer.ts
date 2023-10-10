import { sanitize } from 'sanitizer'
import {
  CreatePostChildCommentApiRequestDto
} from '~/modules/Posts/Infrastructure/Api/Requests/CreatePostChildCommentApiRequestDto'

export class CreatePostChildCommentRequestSanitizer {
  public static sanitize (request: CreatePostChildCommentApiRequestDto): CreatePostChildCommentApiRequestDto {
    const comment = sanitize(request.comment)

    return {
      ...request,
      comment,
    }
  }
}
