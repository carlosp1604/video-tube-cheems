import { z, ZodError } from 'zod'
import { AddPostViewApiRequest } from '~/modules/Posts/Infrastructure/Dtos/AddPostViewApiRequest'
import { PostsApiRequestValidatorError } from '~/modules/Posts/Infrastructure/Validators/PostsApiRequestValidatorError'

export class AddPostViewApiRequestValidator {
  private static addPostViewApiRequestSchema = z.object({
    postId: z.string().uuid(),
    userId: z.string().uuid().nullable(),
  })

  public static validate (request: AddPostViewApiRequest): PostsApiRequestValidatorError | void {
    try {
      this.addPostViewApiRequestSchema.parse(request)
    } catch (exception: unknown) {
      if (!(exception instanceof ZodError)) {
        throw exception
      }

      return PostsApiRequestValidatorError.addPostViewRequest(exception.issues)
    }
  }
}
