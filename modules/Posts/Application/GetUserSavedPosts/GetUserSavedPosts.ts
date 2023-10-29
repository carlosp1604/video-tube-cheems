import { PostRepositoryInterface } from '~/modules/Posts/Domain/PostRepositoryInterface'
import { GetUserSavedPostsRequestDto } from './GetUserSavedPostsRequestDto'
import { GetUserSavedPostsApplicationException } from './GetUserSavedPostsApplicationException'
import { SortingCriteriaValidator } from '~/modules/Shared/Domain/SortingCriteriaValidator'
import { maxPerPage, minPerPage } from '~/modules/Shared/Domain/Pagination'
import { FilterValueValidator } from '~/modules/Shared/Domain/FilterValueValidator'
import { ValidationException } from '~/modules/Shared/Domain/ValidationException'
import {
  GetUserSavedPostsSortingOption
} from '~/modules/Shared/Domain/Posts/PostSorting'
import {
  PostFilterOptionInterface
} from '~/modules/Shared/Domain/Posts/PostFilterOption'
import {
  GetUserSavedPostsSortingOptionValidator
} from '~/modules/Shared/Domain/Posts/Validators/GetUserSavedPostsSortingOptionValidator'
import { SortingCriteria } from '~/modules/Shared/Domain/SortingCriteria'
import {
  GetUserSavedPostsFilterOptionValidator
} from '~/modules/Shared/Domain/Posts/Validators/GetUserSavedPostsFilterOptionValidator'
import { GetPostsApplicationResponse } from '~/modules/Posts/Application/Dtos/GetPostsApplicationDto'
import {
  GetPostsApplicationDtoTranslator
} from '~/modules/Posts/Application/Translators/GetPostsApplicationDtoTranslator'
import { GetPostRequestFilterDto } from '~/modules/Shared/Application/GetPostsApplicationRequestDto'

export class GetUserSavedPosts {
  // eslint-disable-next-line no-useless-constructor
  constructor (private readonly postRepository: PostRepositoryInterface) {}

  public async get (request: GetUserSavedPostsRequestDto): Promise<GetPostsApplicationResponse> {
    GetUserSavedPosts.validateRequest(request)
    const offset = (request.page - 1) * request.postsPerPage

    const filters = GetUserSavedPosts.parseFilters(request.filters)

    const sortingCriteria = GetUserSavedPosts.validateSortingCriteria(request.sortCriteria)
    const sortingOption = GetUserSavedPosts.validateSortingOption(request.sortOption)
    const userId = GetUserSavedPosts.getUserIdFromSavedByFilter(filters)

    const postsWithTotalCount = await this.postRepository.findSavedPostsWithOffsetAndLimit(
      userId,
      offset,
      request.postsPerPage,
      sortingOption,
      sortingCriteria,
      filters
    )

    return GetPostsApplicationDtoTranslator.fromDomain(postsWithTotalCount.posts, postsWithTotalCount.count)
  }

  private static validateRequest (request: GetUserSavedPostsRequestDto): void {
    if (isNaN(request.page) || request.page <= 0) {
      throw GetUserSavedPostsApplicationException.invalidPageValue()
    }

    if (isNaN(request.postsPerPage) || request.postsPerPage < minPerPage || request.postsPerPage > maxPerPage) {
      throw GetUserSavedPostsApplicationException.invalidPerPageValue(minPerPage, maxPerPage)
    }
  }

  private static parseFilters (filters: GetPostRequestFilterDto[]): PostFilterOptionInterface[] {
    return filters.map((filter) => {
      try {
        const validatedFilter = new GetUserSavedPostsFilterOptionValidator().validate(filter.type)
        const validFilterValue = new FilterValueValidator().validate(filter.value)

        return { type: validatedFilter, value: validFilterValue }
      } catch (exception: unknown) {
        if (!(exception instanceof ValidationException)) {
          throw exception
        }

        if (exception.id === ValidationException.invalidFilterTypeId) {
          throw GetUserSavedPostsApplicationException.invalidFilterType(filter.type)
        }

        if (exception.id === ValidationException.invalidFilterValueId) {
          throw GetUserSavedPostsApplicationException.invalidFilterValue()
        }

        throw exception
      }
    })
  }

  private static validateSortingOption (sortingOption: string): GetUserSavedPostsSortingOption {
    try {
      return new GetUserSavedPostsSortingOptionValidator().validate(sortingOption)
    } catch (exception: unknown) {
      if (!(exception instanceof ValidationException)) {
        throw exception
      }

      if (exception.id === ValidationException.invalidSortingOptionId) {
        throw GetUserSavedPostsApplicationException.invalidSortingOption(sortingOption)
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
        throw GetUserSavedPostsApplicationException.invalidSortingCriteria(sortingCriteria)
      }

      throw exception
    }
  }

  private static getUserIdFromSavedByFilter (filters:PostFilterOptionInterface[]): string {
    const savedByFilter = filters.find((filter) => filter.type === 'savedBy')

    if (!savedByFilter) {
      throw GetUserSavedPostsApplicationException.savedByIdFilterMissing()
    }

    return savedByFilter.value
  }
}
