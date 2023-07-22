import { z, ZodError } from 'zod'
import { PostsApiRequestValidatorError } from '~/modules/Posts/Infrastructure/Validators/PostsApiRequestValidatorError'
import { DeletePostReactionApiRequestDto } from '~/modules/Posts/Infrastructure/Dtos/DeletePostReactionApiRequestDto'

export class DeletePosReactionApiRequestValidator {
  private static deletePostReactionApiRequestSchema = z.object({
    postId: z.string().uuid(),
    userId: z.string().uuid(),
  })

  public static validate (request: DeletePostReactionApiRequestDto): PostsApiRequestValidatorError | void {
    try {
      this.deletePostReactionApiRequestSchema.parse(request)
    } catch (exception: unknown) {
      if (!(exception instanceof ZodError)) {
        throw exception
      }

      return PostsApiRequestValidatorError.deletePostReactionRequest(exception.issues)
    }
  }
}
