import { PostRepositoryInterface } from '../Domain/PostRepositoryInterface'
import { PostApplicationDto } from './Dtos/PostApplicationDto'
import { PostApplicationDtoTranslator } from './Translators/PostApplicationDtoTranslator'
import { GetPostsRequestDto } from './Dtos/GetPostsRequestDto'
import { GetPostsApplicationException } from './GetPostsApplicationException'
import { StringHelper } from '../../../helpers/Domain/StringHelper'

export class GetPosts {
  private minLimit = 12
  private maxLimit = 256

  constructor(
    private readonly postRepository: PostRepositoryInterface
  ) {}

  public async get(request: GetPostsRequestDto): Promise<PostApplicationDto[]> {
    this.validateRequest(request)

    // If filter (after deleting special chars) is empty we don't perform the query
    if (
      request.filter !== null &&
      StringHelper.deleteNotAllowedChars(request.filter) === ''
    ) {
      return []
    }

    const posts = await this.postRepository.findWithOffsetAndLimit(
      request.offset,
      request.limit,
      request.sortOption,
      request.sortCriteria,
      request.filter !== null
        ? { type: 'title', value: request.filter } : undefined
    )

    console.log(posts.length)

    return posts.map((post) => {
      return PostApplicationDtoTranslator.fromDomain(post)
    })
  }

  private validateRequest(request: GetPostsRequestDto): void {
    if (
      isNaN(request.offset) ||
      request.offset < 0
    ) {
      throw GetPostsApplicationException.invalidOffsetValue()
    }

    if (
      isNaN(request.limit) ||
      request.limit < this.minLimit ||
      request.limit > this.maxLimit
    ) {
      throw GetPostsApplicationException.invalidLimitValue(this.minLimit, this.maxLimit)
    }
  }
}