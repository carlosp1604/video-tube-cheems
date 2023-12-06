import { PostRepositoryInterface } from '~/modules/Posts/Domain/PostRepositoryInterface'
import { SortingCriteriaValidator } from '~/modules/Shared/Domain/SortingCriteriaValidator'
import { maxPerPage, minPerPage } from '~/modules/Shared/Domain/Pagination'
import { FilterValueValidator } from '~/modules/Shared/Domain/FilterValueValidator'
import { ValidationException } from '~/modules/Shared/Domain/ValidationException'
import {
  GetUserHistorySortingOption
} from '~/modules/Shared/Domain/Posts/PostSorting'
import {
  PostFilterOptionInterface
} from '~/modules/Shared/Domain/Posts/PostFilterOption'
import { SortingCriteria } from '~/modules/Shared/Domain/SortingCriteria'
import { GetPostsApplicationResponse } from '~/modules/Posts/Application/Dtos/GetPostsApplicationDto'
import {
  GetPostsApplicationDtoTranslator
} from '~/modules/Posts/Application/Translators/GetPostsApplicationDtoTranslator'
import { GetPostRequestFilterDto } from '~/modules/Shared/Application/GetPostsApplicationRequestDto'
import {
  GetUserHistoryApplicationRequestDto
} from '~/modules/Posts/Application/GetUserHistory/GetUserHistoryApplicationRequestDto'
import {
  GetUserHistorySortingOptionValidator
} from '~/modules/Shared/Domain/Posts/Validators/GetUserHistorySortingOptionValidator'
import {
  GetUserHistoryApplicationException
} from '~/modules/Posts/Application/GetUserHistory/GetUserHistoryApplicationException'
import {
  GetUserHistoryFilterOptionValidator
} from '~/modules/Shared/Domain/Posts/Validators/GetUserHistoryFilterOptionValidator'

export class GetUserHistory {
  // eslint-disable-next-line no-useless-constructor
  constructor (private readonly postRepository: PostRepositoryInterface) {}

  public async get (request: GetUserHistoryApplicationRequestDto): Promise<GetPostsApplicationResponse> {
    GetUserHistory.validateRequest(request)
    const offset = (request.page - 1) * request.postsPerPage

    const filters = GetUserHistory.parseFilters(request.filters)

    const sortingCriteria = GetUserHistory.validateSortingCriteria(request.sortCriteria)
    const sortingOption = GetUserHistory.validateSortingOption(request.sortOption)
    const userId = GetUserHistory.getUserIdFromViewedByFilter(filters)

    const postsWithTotalCount = await this.postRepository.findViewedPostsWithOffsetAndLimit(
      userId,
      offset,
      request.postsPerPage,
      sortingOption,
      sortingCriteria,
      filters
    )

    return GetPostsApplicationDtoTranslator.fromDomain(postsWithTotalCount.posts, postsWithTotalCount.count)
  }

  private static validateRequest (request: GetUserHistoryApplicationRequestDto): void {
    if (isNaN(request.page) || request.page <= 0) {
      throw GetUserHistoryApplicationException.invalidPageValue()
    }

    if (isNaN(request.postsPerPage) || request.postsPerPage < minPerPage || request.postsPerPage > maxPerPage) {
      throw GetUserHistoryApplicationException.invalidPerPageValue(minPerPage, maxPerPage)
    }
  }

  private static parseFilters (filters: GetPostRequestFilterDto[]): PostFilterOptionInterface[] {
    return filters.map((filter) => {
      try {
        const validatedFilter = new GetUserHistoryFilterOptionValidator().validate(filter.type)
        const validFilterValue = new FilterValueValidator().validate(filter.value)

        return { type: validatedFilter, value: validFilterValue }
      } catch (exception: unknown) {
        if (!(exception instanceof ValidationException)) {
          throw exception
        }

        if (exception.id === ValidationException.invalidFilterTypeId) {
          throw GetUserHistoryApplicationException.invalidFilterType(filter.type)
        }

        if (exception.id === ValidationException.invalidFilterValueId) {
          throw GetUserHistoryApplicationException.invalidFilterValue()
        }

        throw exception
      }
    })
  }

  private static validateSortingOption (sortingOption: string): GetUserHistorySortingOption {
    try {
      return new GetUserHistorySortingOptionValidator().validate(sortingOption)
    } catch (exception: unknown) {
      if (!(exception instanceof ValidationException)) {
        throw exception
      }

      if (exception.id === ValidationException.invalidSortingOptionId) {
        throw GetUserHistoryApplicationException.invalidSortingOption(sortingOption)
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
        throw GetUserHistoryApplicationException.invalidSortingCriteria(sortingCriteria)
      }

      throw exception
    }
  }

  private static getUserIdFromViewedByFilter (filters:PostFilterOptionInterface[]): string {
    const viewedByFilter = filters.find((filter) => filter.type === 'viewedBy')

    if (!viewedByFilter) {
      throw GetUserHistoryApplicationException.viewedByIdFilterMissing()
    }

    return viewedByFilter.value
  }
}
