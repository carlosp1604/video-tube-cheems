import { z, ZodError } from 'zod'
import { maxPerPage, minPerPage } from '../../../Shared/Infrastructure/Pagination'
import { GetPostPostCommentsApiRequestDto } from '../Dtos/GetPostPostCommentsApiRequestDto'
import { PostCommentApiRequestValidatorError } from './PostCommentApiRequestValidatorError'

export class GetPostPostCommentsApiRequestValidator {
  private static getPostPostCommentsApiRequestSchema = z.object({
    postId: z.string({}).uuid(),
    page: z.number().positive().min(0),
    perPage: z.number().positive().min(minPerPage).max(maxPerPage),
    parentCommentId: z.string({}).uuid().nullable()
  })

  public static validate(request: GetPostPostCommentsApiRequestDto): PostCommentApiRequestValidatorError | void {
    try {
      this.getPostPostCommentsApiRequestSchema.parse(request)
    }
    catch (exception: unknown) {
      if (!(exception instanceof ZodError)) {
        throw exception
      }

      return PostCommentApiRequestValidatorError.getPostCommentsValidator(exception.issues)
    }

    return
  }
}