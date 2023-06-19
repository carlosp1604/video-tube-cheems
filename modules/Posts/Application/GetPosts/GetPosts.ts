import { PostRepositoryFilterOption, PostRepositoryInterface } from '~/modules/Posts/Domain/PostRepositoryInterface'
import { GetPostRequestFilterDto, GetPostsRequestDto } from './GetPostsRequestDto'
import { GetPostsApplicationException } from './GetPostsApplicationException'
import { GetPostsApplicationResponse } from './GetPostsApplicationDto'
import { GetPostsApplicationDtoTranslator } from './GetPostsApplicationDtoTranslator'
import { FilterOptionValidator } from '~/modules/Shared/Domain/FilterOptionValidator'
import { SortingCriteriaValidator } from '~/modules/Shared/Domain/SortingCriteriaValidator'
import { SortingOptionValidator } from '~/modules/Shared/Domain/SortingOptionValidator'
import { maxPerPage, minPerPage } from '~/modules/Shared/Domain/Pagination'
import { FilterValueValidator } from '~/modules/Shared/Domain/FilterValueValidator'
import { ValidationException } from '~/modules/Shared/Domain/ValidationException'
import { RepositorySortingCriteria, RepositorySortingOptions } from '~/modules/Shared/Domain/RepositorySorting'

export class GetPosts {
  // eslint-disable-next-line no-useless-constructor
  constructor (private readonly postRepository: PostRepositoryInterface) {}

  public async get (request: GetPostsRequestDto): Promise<GetPostsApplicationResponse> {
    GetPosts.validateRequest(request)
    const offset = (request.page - 1) * request.postsPerPage

    const filters = GetPosts.parseFilters(request.filters)

    const sortingCriteria = GetPosts.validateSortingCriteria(request.sortCriteria)
    const sortingOption = GetPosts.validateSortingOption(request.sortOption)

    const [posts, postsNumber] = await Promise.all([
      await this.postRepository.findWithOffsetAndLimit(
        offset,
        request.postsPerPage,
        sortingOption,
        sortingCriteria,
        filters
      ),
      await this.postRepository.countPostsWithFilters(filters),
    ])

    console.log(posts[0])

    return GetPostsApplicationDtoTranslator.fromDomain(posts, postsNumber)
  }

  private static validateRequest (request: GetPostsRequestDto): void {
    if (isNaN(request.page) || request.page <= 0) {
      throw GetPostsApplicationException.invalidOffsetValue()
    }

    if (isNaN(request.postsPerPage) || request.postsPerPage < minPerPage || request.postsPerPage > maxPerPage) {
      throw GetPostsApplicationException.invalidLimitValue(minPerPage, maxPerPage)
    }
  }

  private static parseFilters (filters: GetPostRequestFilterDto[]): PostRepositoryFilterOption[] {
    return filters.map((filter) => {
      try {
        const validatedFilter = new FilterOptionValidator().validate(filter.type)
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

  private static validateSortingOption (sortingOption: string): RepositorySortingOptions {
    try {
      return new SortingOptionValidator().validate(sortingOption)
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

  private static validateSortingCriteria (sortingCriteria: string): RepositorySortingCriteria {
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
