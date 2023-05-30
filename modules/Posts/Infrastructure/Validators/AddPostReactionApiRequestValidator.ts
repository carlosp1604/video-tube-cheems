import { z, ZodError } from 'zod'
import { PostsApiRequestValidatorError } from '~/modules/Posts/Infrastructure/Validators/PostsApiRequestValidatorError'
import { AddPostReactionApiRequest } from '~/modules/Posts/Infrastructure/Dtos/AddPostReactionApiRequest'

export class AddPostReactionApiRequestValidator {
  private static addPostReactionApiRequestSchema = z.object({
    postId: z.string().uuid(),
    userId: z.string().uuid(),
    reactionType: z.string().min(1),
  })

  public static validate (request: AddPostReactionApiRequest): PostsApiRequestValidatorError | void {
    try {
      this.addPostReactionApiRequestSchema.parse(request)
    } catch (exception: unknown) {
      if (!(exception instanceof ZodError)) {
        throw exception
      }

      return PostsApiRequestValidatorError.addPostReactionRequest(exception.issues)
    }
  }
}
