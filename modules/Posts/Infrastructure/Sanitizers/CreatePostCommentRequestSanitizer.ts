import { sanitize } from 'sanitizer'
import { CreatePostCommentApiRequestDto } from '~/modules/Posts/Infrastructure/Dtos/CreatePostCommentApiRequestDto'

export class CreatePostCommentRequestSanitizer {
  public static sanitize (request: CreatePostCommentApiRequestDto): CreatePostCommentApiRequestDto {
    const comment = sanitize(request.comment)

    return {
      ...request,
      comment,
    }
  }
}
