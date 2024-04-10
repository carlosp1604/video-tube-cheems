import { PostRepositoryInterface } from '~/modules/Posts/Domain/PostRepositoryInterface'
import { GetPostsApplicationDto } from './GetPostsApplicationRequestDto'
import { GetPostsApplicationException } from './GetPostsApplicationException'
import { GetPostsFilterOptionValidator } from '~/modules/Shared/Domain/Posts/Validators/GetPostsFilterOptionValidator'
import { SortingCriteriaValidator } from '~/modules/Shared/Domain/SortingCriteriaValidator'
import { GetPostsSortingOptionValidator } from '~/modules/Shared/Domain/Posts/Validators/GetPostsSortingOptionValidator'
import { maxPerPage, minPerPage } from '~/modules/Shared/Domain/Pagination'
import { FilterValueValidator } from '~/modules/Shared/Domain/FilterValueValidator'
import { ValidationException } from '~/modules/Shared/Domain/ValidationException'
import { GetPostsSortingOption } from '~/modules/Shared/Domain/Posts/PostSorting'
import { PostFilterOptionInterface } from '~/modules/Shared/Domain/Posts/PostFilterOption'
import { SortingCriteria } from '~/modules/Shared/Domain/SortingCriteria'
import {
  GetPostsApplicationDtoTranslator
} from '~/modules/Posts/Application/Translators/GetPostsApplicationDtoTranslator'
import {
  GetPostRequestFilterDto,
  GetPostsApplicationRequestDto
} from '~/modules/Shared/Application/GetPostsApplicationRequestDto'
import { GetPostsApplicationResponse } from '~/modules/Posts/Application/Dtos/GetPostsApplicationDto'

export class GetPosts {
  // eslint-disable-next-line no-useless-constructor
  constructor (private readonly postRepository: PostRepositoryInterface) {}

  public async get (request: GetPostsApplicationDto): Promise<GetPostsApplicationResponse> {
    GetPosts.validateRequest(request)
    const offset = (request.page - 1) * request.postsPerPage

    const filters = GetPosts.parseFilters(request.filters)

    const sortingCriteria = GetPosts.validateSortingCriteria(request.sortCriteria)
    const sortingOption = GetPosts.validateSortingOption(request.sortOption)

    const postsWithCount = await this.postRepository.findWithOffsetAndLimit(
      offset,
      request.postsPerPage,
      sortingOption,
      sortingCriteria,
      filters
    )

    return GetPostsApplicationDtoTranslator.fromDomain(postsWithCount.posts, postsWithCount.count)
  }

  private static validateRequest (request: GetPostsApplicationRequestDto): void {
    if (isNaN(request.page) || request.page <= 0) {
      throw GetPostsApplicationException.invalidPageValue()
    }

    if (isNaN(request.postsPerPage) || request.postsPerPage < minPerPage || request.postsPerPage > maxPerPage) {
      throw GetPostsApplicationException.invalidPerPageValue(minPerPage, maxPerPage)
    }
  }

  private static parseFilters (filters: GetPostRequestFilterDto[]): PostFilterOptionInterface[] {
    return filters.map((filter) => {
      try {
        const validatedFilter = new GetPostsFilterOptionValidator().validate(filter.type)
        const validFilterValue = new FilterValueValidator().validate(filter.value)

        return { type: validatedFilter, value: validFilterValue }
      } catch (exception: unknown) {
        if (!(exception instanceof ValidationException)) {
          throw exception
        }

        if (exception.id === ValidationException.invalidFilterTypeId) {
          throw GetPostsApplicationException.invalidFilterType(filter.type)
        }

        if (exception.id === ValidationException.invalidFilterValueId) {
          throw GetPostsApplicationException.invalidFilterValue()
        }

        throw exception
      }
    })
  }

  private static validateSortingOption (sortingOption: string): GetPostsSortingOption {
    try {
      return new GetPostsSortingOptionValidator().validate(sortingOption)
    } catch (exception: unknown) {
      if (!(exception instanceof ValidationException)) {
        throw exception
      }

      if (exception.id === ValidationException.invalidSortingOptionId) {
        throw GetPostsApplicationException.invalidSortingOption(sortingOption)
      }

      throw exception
    }
  }

  private static validateSortingCriteria (sortingCriteria: string): SortingCriteria {
    try {
      return new SortingCriteriaValidator().validate(sortingCriteria)
    } catch (exception: unknown) {
      if (!(exception instanceof ValidationException)) {
        throw exception
      }

      if (exception.id === ValidationException.invalidSortingCriteriaId) {
        throw GetPostsApplicationException.invalidSortingCriteria(sortingCriteria)
      }

      throw exception
    }
  }
}
