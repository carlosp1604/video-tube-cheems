import { z, ZodError } from 'zod'
import { PostCommentApiRequestValidatorError } from './PostCommentApiRequestValidatorError'
import { GetPostPostCommentsApiRequestDto } from '~/modules/Posts/Infrastructure/Api/Requests/GetPostPostCommentsApiRequestDto'

export class GetPostPostCommentsApiRequestValidator {
  private static getPostPostCommentsApiRequestSchema = z.object({
    postId: z.string({}).uuid(),
    page: z.number().positive().min(1),
    perPage: z.number().positive().min(1),
  })

  public static validate (request: GetPostPostCommentsApiRequestDto): PostCommentApiRequestValidatorError | void {
    try {
      this.getPostPostCommentsApiRequestSchema.parse(request)
    } catch (exception: unknown) {
      if (!(exception instanceof ZodError)) {
        throw exception
      }

      return PostCommentApiRequestValidatorError.getPostCommentsValidation(exception.issues)
    }
  }
}
