import { GetActorsRequestDto } from './GetActorsRequestDto'
import { GetActorsApplicationDto } from './GetActorsApplicationDto'
import { GetActorsApplicationDtoTranslator } from './GetActorsApplicationDtoTranslator'
import { ActorRepositoryInterface } from '~/modules/Actors/Domain/ActorRepositoryInterface'
import { ValidationException } from '~/modules/Shared/Domain/ValidationException'
import { GetPostsSortingOptionValidator } from '~/modules/Shared/Domain/Posts/Validators/GetPostsSortingOptionValidator'
import { SortingCriteriaValidator } from '~/modules/Shared/Domain/SortingCriteriaValidator'
import { maxPerPage, minPerPage } from '~/modules/Shared/Domain/Pagination'
import { GetActorsApplicationException } from '~/modules/Actors/Application/GetActorsApplicationException'
import { GetPostRequestFilterDto } from '~/modules/Shared/Application/GetPostsApplicationRequestDto'
import { SortingCriteria } from '~/modules/Shared/Domain/SortingCriteria'
import { PostSortingOption } from '~/modules/Shared/Domain/Posts/PostSorting'

export class GetActors {
  // eslint-disable-next-line no-useless-constructor
  constructor (private readonly actorRepository: ActorRepositoryInterface) {}

  public async get (request: GetActorsRequestDto): Promise<GetActorsApplicationDto> {
    GetActors.validateRequest(request)
    const offset = (request.page - 1) * request.actorsPerPage

    const filters = GetActors.parseFilters(request.filters)

    const sortingCriteria = GetActors.validateSortingCriteria(request.sortCriteria)
    const sortingOption = GetActors.validateSortingOption(request.sortOption)

    const [actors, actorsNumber] = await Promise.all([
      await this.actorRepository.findWithOffsetAndLimit(
        offset,
        request.actorsPerPage,
        sortingOption,
        sortingCriteria,
        filters
      ),
      await this.actorRepository.countPostsWithFilters(filters),
    ])

    return GetActorsApplicationDtoTranslator.fromDomain(
      actors,
      actorsNumber
    )
  }

  private static validateRequest (request: GetActorsRequestDto): void {
    if (isNaN(request.page) || request.page <= 0) {
      throw GetActorsApplicationException.invalidOffsetValue()
    }

    if (isNaN(request.actorsPerPage) || request.actorsPerPage < minPerPage || request.actorsPerPage > maxPerPage) {
      throw GetActorsApplicationException.invalidLimitValue(minPerPage, maxPerPage)
    }
  }

  private static parseFilters (filters: GetPostRequestFilterDto[]): [] {
    return []
  }

  private static validateSortingOption (sortingOption: string): PostSortingOption {
    try {
      return new GetPostsSortingOptionValidator().validate(sortingOption)
    } catch (exception: unknown) {
      if (!(exception instanceof ValidationException)) {
        throw exception
      }

      if (exception.id === ValidationException.invalidSortingOptionId) {
        throw GetActorsApplicationException.invalidSortingOption(sortingOption)
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
        throw GetActorsApplicationException.invalidSortingCriteria(sortingCriteria)
      }

      throw exception
    }
  }
}
