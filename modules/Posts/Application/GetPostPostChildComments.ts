import { maxPostsPerPage, minPostsPerPage } from '../../Shared/Application/Pagination'
import { PostComment } from '../Domain/PostComment'
import { PostCommentRepositoryInterface } from '../Domain/PostCommentRepositoryInterface'
import { ChildCommentApplicationDto } from './Dtos/ChildCommentApplicationDto'
import { GetPostPostChildCommentsRespondeDto } from './Dtos/GetPostPostChildCommentsResponseDto'
import { GetPostPostCommentsApplicationException } from './GetPostPostCommentsApplicationException'
import { ChildCommentApplicationDtoTranslator } from './Translators/ChildCommentApplicationDtoTranslator'

export class GetPostPostChildComments {
  constructor(private repository: PostCommentRepositoryInterface) {}

  public async get(
    parentCommentId: PostComment['id'],
    page: number,
    perPage: number,
  ): Promise<GetPostPostChildCommentsRespondeDto> {
    this.validateRequest(page, perPage)

    const offset = (page - 1) * perPage

    const [postComments, childCommentsCount] = await Promise.all([
      await this.repository.findChildsWithOffsetAndLimit(
        parentCommentId,
        offset,
        perPage
      ),
      await this.repository.countPostChildComments(parentCommentId)
    ])

    const commentApplicationDtos: ChildCommentApplicationDto[] = postComments.map((comment) => {
      return ChildCommentApplicationDtoTranslator.fromDomain(comment)
    })

    return {
      childComments: commentApplicationDtos,
      childCommentsCount: childCommentsCount,
    }
  }

  private validateRequest(page: number, perPage: number): void {
    if (isNaN(page) || page <= 0) {
      throw GetPostPostCommentsApplicationException.invalidOffsetValue()
    }

    if (
      isNaN(perPage) ||
      perPage < minPostsPerPage ||
      perPage > maxPostsPerPage
    ) {
      throw GetPostPostCommentsApplicationException.invalidLimitValue(minPostsPerPage, maxPostsPerPage)
    }
  }
}