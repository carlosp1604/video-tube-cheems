import { z, ZodError } from 'zod'
import { PostCommentApiRequestValidatorError } from './PostCommentApiRequestValidatorError'
import {
  GetPostPostChildCommentsApiRequestDto
} from '~/modules/Posts/Infrastructure/Api/Requests/GetPostPostChildCommentsApiRequestDto'

export class GetPostPostChildCommentsApiRequestValidator {
  private static getPostPostCommentsApiRequestSchema = z.object({
    page: z.number().positive().min(1),
    perPage: z.number().positive().min(1),
    parentCommentId: z.string({}).uuid(),
  })

  public static validate (request: GetPostPostChildCommentsApiRequestDto): PostCommentApiRequestValidatorError | void {
    try {
      this.getPostPostCommentsApiRequestSchema.parse(request)
    } catch (exception: unknown) {
      if (!(exception instanceof ZodError)) {
        throw exception
      }

      return PostCommentApiRequestValidatorError.getPostChildCommentsValidation(exception.issues)
    }
  }
}
