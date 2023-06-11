import { z, ZodError } from 'zod'
import { PostCommentApiRequestValidatorError } from './PostCommentApiRequestValidatorError'
import { maxPerPage, minPerPage } from '~/modules/Shared/Infrastructure/Pagination'
import {
  GetPostPostChildCommentsApiRequestDto
} from '~/modules/Posts/Infrastructure/Dtos/GetPostPostChildCommentsApiRequestDto'

export class GetPostPostChildCommentsApiRequestValidator {
  private static getPostPostCommentsApiRequestSchema = z.object({
    postId: z.string({}).uuid(),
    page: z.number().positive().min(0),
    perPage: z.number().positive().min(minPerPage).max(maxPerPage),
    parentCommentId: z.string({}).uuid(),
  })

  public static validate (request: GetPostPostChildCommentsApiRequestDto): PostCommentApiRequestValidatorError | void {
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
