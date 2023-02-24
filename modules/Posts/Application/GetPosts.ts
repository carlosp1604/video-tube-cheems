import { PostRepositoryFilterOption, PostRepositoryInterface } from '../Domain/PostRepositoryInterface'
import { GetPostsRequestDto } from './Dtos/GetPostsRequestDto'
import { GetPostsApplicationException } from './GetPostsApplicationException'
import { maxPostsPerPage, minPostsPerPage } from '../../Shared/Application/Pagination'
import { GetPostsApplicationResponse } from './Dtos/GetPostsApplicationDto'
import { GetPostsApplicationDtoTranslator } from './Translators/GetPostsApplicationDtoTranslator'
import { RepositoryFilter } from '../../Shared/Domain/RepositoryFilter'

export class GetPosts {
  constructor(
    private readonly postRepository: PostRepositoryInterface
  ) {}

  public async get(request: GetPostsRequestDto): Promise<GetPostsApplicationResponse> {
    this.validateRequest(request)
    const offset = (request.page - 1) * request.postsPerPage

    const filters: RepositoryFilter<PostRepositoryFilterOption>[] = 
      request.filters.map((filter) => {
        return {
          type: filter.type as PostRepositoryFilterOption,
          value: filter.value,
        }
      })

    const [posts, postsNumber] = await Promise.all([
      await this.postRepository.findWithOffsetAndLimit(
        offset,
        request.postsPerPage,
        request.sortOption,
        request.sortCriteria,
        filters,
      ),
      await this.postRepository.countPostsWithFilters(filters)
    ])

    return GetPostsApplicationDtoTranslator.fromDomain(
      posts,
      postsNumber
    )
  }

  private validateRequest(request: GetPostsRequestDto): void {
    if (
      isNaN(request.page) ||
      request.page <= 0
    ) {
      throw GetPostsApplicationException.invalidOffsetValue()
    }

    if (
      isNaN(request.postsPerPage) ||
      request.postsPerPage < minPostsPerPage ||
      request.postsPerPage > maxPostsPerPage
    ) {
      throw GetPostsApplicationException.invalidLimitValue(minPostsPerPage, maxPostsPerPage)
    }
  }
}