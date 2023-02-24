import { RepositoryFilter } from '../../Shared/Domain/RepositoryFilter'
import { ActorRepositoryFilterOption, ActorRepositoryInterface } from '../Domain/ActorRepositoryInterface'
import { GetActorsRequestDto } from './GetActorsRequestDto'
import { GetActorsApplicationDto } from './GetActorsApplicationDto'
import { GetActorsApplicationDtoTranslator } from './GetActorsApplicationDtoTranslator'
import { GetPostsApplicationException } from '../../Posts/Application/GetPostsApplicationException'
import { maxPostsPerPage, minPostsPerPage } from '../../Shared/Application/Pagination'

export class GetActors {
  constructor(
    private readonly actorRepository: ActorRepositoryInterface
  ) {}

  public async get(request: GetActorsRequestDto): Promise<GetActorsApplicationDto> {
    this.validateRequest(request)
    const offset = (request.page - 1) * request.actorsPerPage

    const filters: RepositoryFilter<ActorRepositoryFilterOption>[] = 
      request.filters.map((filter) => {
        return {
          type: filter.type as ActorRepositoryFilterOption,
          value: filter.value,
        }
      })

    const [actors, actorsNumber] = await Promise.all([
      await this.actorRepository.findWithOffsetAndLimit(
        offset,
        request.actorsPerPage,
        request.sortOption,
        request.sortCriteria,
        filters,
      ),
      await this.actorRepository.countPostsWithFilters(filters)
    ])

    return GetActorsApplicationDtoTranslator.fromDomain(
      actors,
      actorsNumber
    )
  }

  private validateRequest(request: GetActorsRequestDto): void {
    if (
      isNaN(request.page) ||
      request.page <= 0
    ) {
      throw GetPostsApplicationException.invalidOffsetValue()
    }

    if (
      isNaN(request.actorsPerPage) ||
      request.actorsPerPage < minPostsPerPage ||
      request.actorsPerPage > maxPostsPerPage
    ) {
      throw GetPostsApplicationException.invalidLimitValue(minPostsPerPage, maxPostsPerPage)
    }
  }
}