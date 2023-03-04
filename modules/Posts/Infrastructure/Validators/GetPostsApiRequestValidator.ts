import { z, ZodError } from 'zod'
import { PostCommentApiRequestValidatorError } from './PostCommentApiRequestValidatorError'
import { GetPostsApiRequestDto } from '../Dtos/GetPostsApiRequestDto'
import { minPerPage, maxPerPage } from '../../../Shared/Infrastructure/Pagination'
import { SortingInfrastructureCriteria, SortingInfrastructureOptions } from '../../../Shared/Infrastructure/InfrastructureSorting'
import { PostFilterOptions } from '../PostFilters'
import { PostsApiRequestValidatorError } from './PostsApiRequestValidatorError'

export class GetPostsApiRequestValidator {
  private static getPostsApiRequestSchema = z.object({
    page: z.number().positive().min(0),
    postsPerPage: z.number().positive().min(minPerPage).max(maxPerPage),
    filters: z.array(z.object({
      type: z.nativeEnum(PostFilterOptions),
      value: z.string().min(1),
    })),
    sortOption: z.nativeEnum(SortingInfrastructureOptions),
    sortCriteria: z.nativeEnum(SortingInfrastructureCriteria)
  })

  public static validate(request: GetPostsApiRequestDto): PostCommentApiRequestValidatorError | void {
    try {
      this.getPostsApiRequestSchema.parse(request)
    }
    catch (exception: unknown) {
      if (!(exception instanceof ZodError)) {
        throw exception
      }

      return PostsApiRequestValidatorError.getPostsValidation(exception.issues)
    }

    return
  }
}