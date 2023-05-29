import { z, ZodError } from 'zod'
import { PostCommentApiRequestValidatorError } from './PostCommentApiRequestValidatorError'
import { PostsApiRequestValidatorError } from './PostsApiRequestValidatorError'
import { GetPostsApiRequestDto } from '~/modules/Posts/Infrastructure/Dtos/GetPostsApiRequestDto'

export class GetPostsApiRequestValidator {
  private static getPostsApiRequestSchema = z.object({
    page: z.number().positive(),
    postsPerPage: z.number().positive(),
    filters: z.array(z.object({
      type: z.string().min(1),
      value: z.string().min(1),
    })),
    sortOption: z.string().min(1),
    sortCriteria: z.string().min(1),
  })

  public static validate (request: GetPostsApiRequestDto): PostCommentApiRequestValidatorError | void {
    try {
      this.getPostsApiRequestSchema.parse(request)
    } catch (exception: unknown) {
      if (!(exception instanceof ZodError)) {
        throw exception
      }

      return PostsApiRequestValidatorError.getPostsValidation(exception.issues)
    }
  }
}
