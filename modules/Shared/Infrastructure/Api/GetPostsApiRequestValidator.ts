import { z, ZodError } from 'zod'
import { GetPostsApiRequestDto } from '~/modules/Shared/Infrastructure/Api/GetPostsApiRequestDto'
import {
  PostsApiRequestValidatorError
} from '~/modules/Posts/Infrastructure/Api/Validators/PostsApiRequestValidatorError'

export class GetPostsApiRequestValidator {
  private static getPostsApiRequestSchema = z.object({
    page: z.number().positive().min(1),
    perPage: z.number().positive().min(1),
    filters: z.array(z.object({
      type: z.string().min(1),
      value: z.string().min(1),
    })),
    orderBy: z.string().min(1),
    order: z.string().min(1),
  })

  public static validate (request: Partial<GetPostsApiRequestDto>): PostsApiRequestValidatorError | void {
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
