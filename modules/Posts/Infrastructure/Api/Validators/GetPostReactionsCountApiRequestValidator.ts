import { z, ZodError } from 'zod'
import { PostsApiRequestValidatorError } from '~/modules/Posts/Infrastructure/Api/Validators/PostsApiRequestValidatorError'
import {
  GetPostReactionsCountApiRequest
} from '~/modules/Posts/Infrastructure/Api/Requests/GetPostReactionsCountApiRequestDto'

export class GetPostReactionsCountApiRequestValidator {
  private static getPostReactionsCountApiRequestSchema = z.object({
    postId: z.string().uuid(),
  })

  public static validate (request: GetPostReactionsCountApiRequest): PostsApiRequestValidatorError | void {
    try {
      this.getPostReactionsCountApiRequestSchema.parse(request)
    } catch (exception: unknown) {
      if (!(exception instanceof ZodError)) {
        throw exception
      }

      return PostsApiRequestValidatorError.getPostReactionsCountRequest(exception.issues)
    }
  }
}
