import { z, ZodError } from 'zod'
import {
  CreatePostCommentReactionApiRequestDto
} from '~/modules/Posts/Infrastructure/Api/Requests/CreatePostCommentReactionApiRequestDto'
import {
  PostCommentApiRequestValidatorError
} from '~/modules/Posts/Infrastructure/Api/Validators/PostCommentApiRequestValidatorError'

export class CreatePostCommentReactionApiRequestValidator {
  private static createPostCommentReactionApiRequestSchema = z.object({
    postCommentId: z.string().uuid(),
    userId: z.string().uuid(),
    parentCommentId: z.string().uuid().nullable(),
  })

  public static validate (request: CreatePostCommentReactionApiRequestDto): PostCommentApiRequestValidatorError | void {
    try {
      this.createPostCommentReactionApiRequestSchema.parse(request)
    } catch (exception: unknown) {
      if (!(exception instanceof ZodError)) {
        throw exception
      }

      return PostCommentApiRequestValidatorError.createPostCommentReactionValidation(exception.issues)
    }
  }
}
