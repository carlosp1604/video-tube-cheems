import { z, ZodError } from 'zod'
import { PostCommentApiRequestValidatorError } from './PostCommentApiRequestValidatorError'
import { GetPostPostCommentsApiRequestDto } from '~/modules/Posts/Infrastructure/Dtos/GetPostPostCommentsApiRequestDto'
import { maxPerPage, minPerPage } from '~/modules/Shared/Infrastructure/Pagination'

export class GetPostPostCommentsApiRequestValidator {
  private static getPostPostCommentsApiRequestSchema = z.object({
    postId: z.string({}).uuid(),
    page: z.number().positive().min(0),
    perPage: z.number().positive().min(minPerPage).max(maxPerPage),
  })

  public static validate (request: GetPostPostCommentsApiRequestDto): PostCommentApiRequestValidatorError | void {
    try {
      this.getPostPostCommentsApiRequestSchema.parse(request)
    } catch (exception: unknown) {
      if (!(exception instanceof ZodError)) {
        throw exception
      }

      return PostCommentApiRequestValidatorError.getPostCommentsValidator(exception.issues)
    }
  }
}
