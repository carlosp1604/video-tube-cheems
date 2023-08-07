import { z, ZodError } from 'zod'
import {
  GetPostUserInteractionApiRequestDto
} from '~/modules/Posts/Infrastructure/Dtos/GetPostUserInteractionApiRequestDto'
import { PostsApiRequestValidatorError } from '~/modules/Posts/Infrastructure/Validators/PostsApiRequestValidatorError'

export class GetPostUserInteractionApiRequestValidator {
  private static getPostUserInteractionApiRequestSchema = z.object({
    postId: z.string().uuid(),
    userId: z.string().uuid(),
  })

  public static validate (request: GetPostUserInteractionApiRequestDto): PostsApiRequestValidatorError | void {
    try {
      this.getPostUserInteractionApiRequestSchema.parse(request)
    } catch (exception: unknown) {
      if (!(exception instanceof ZodError)) {
        throw exception
      }

      return PostsApiRequestValidatorError.getPostUserInteractionRequest(exception.issues)
    }
  }
}
