import { GetActorsApplicationRequestDto } from './GetActorsApplicationRequestDto'
import { GetActorsApplicationResponseDto } from './GetActorsApplicationResponseDto'
import { ActorRepositoryInterface } from '~/modules/Actors/Domain/ActorRepositoryInterface'
import { ValidationException } from '~/modules/Shared/Domain/ValidationException'
import { SortingCriteriaValidator } from '~/modules/Shared/Domain/SortingCriteriaValidator'
import { maxPerPage, minPerPage } from '~/modules/Shared/Domain/Pagination'
import { GetActorsApplicationException } from '~/modules/Actors/Application/GetActors/GetActorsApplicationException'
import { SortingCriteria } from '~/modules/Shared/Domain/SortingCriteria'
import { ActorSortingOption } from '~/modules/Actors/Domain/ActorSorting'
import { GetActorsSortingOptionValidator } from '~/modules/Actors/Domain/Validators/GetActorsSortingOptionValidator'
import {
  GetActorsApplicationResponseDtoTranslator
} from '~/modules/Actors/Application/GetActors/GetActorsApplicationResponseDtoTranslator'

export class GetActors {
  // eslint-disable-next-line no-useless-constructor
  constructor (private readonly actorRepository: ActorRepositoryInterface) {}

  public async get (request: GetActorsApplicationRequestDto): Promise<GetActorsApplicationResponseDto> {
    GetActors.validateRequest(request)
    const offset = (request.page - 1) * request.actorsPerPage

    const sortingCriteria = GetActors.validateSortingCriteria(request.sortCriteria)
    const sortingOption = GetActors.validateSortingOption(request.sortOption)

    const actors = await this.actorRepository.findWithOffsetAndLimit(
      offset,
      request.actorsPerPage,
      sortingOption,
      sortingCriteria
    )

    return GetActorsApplicationResponseDtoTranslator.fromDomain(actors)
  }

  private static validateRequest (request: GetActorsApplicationRequestDto): void {
    if (isNaN(request.page) || request.page <= 0) {
      throw GetActorsApplicationException.invalidOffsetValue()
    }

    if (isNaN(request.actorsPerPage) || request.actorsPerPage < minPerPage || request.actorsPerPage > maxPerPage) {
      throw GetActorsApplicationException.invalidLimitValue(minPerPage, maxPerPage)
    }
  }

  private static validateSortingOption (sortingOption: string): ActorSortingOption {
    try {
      return new GetActorsSortingOptionValidator().validate(sortingOption)
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
