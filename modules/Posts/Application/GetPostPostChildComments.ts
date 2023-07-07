import { ChildCommentApplicationDto } from './Dtos/ChildCommentApplicationDto'
import { GetPostPostChildCommentsRespondeDto } from './Dtos/GetPostPostChildCommentsResponseDto'
import { GetPostPostCommentsApplicationException } from '~/modules/Posts/Application/GetPostPostComments/GetPostPostCommentsApplicationException'
import { ChildCommentApplicationDtoTranslator } from './Translators/ChildCommentApplicationDtoTranslator'
import { maxPerPage, minPerPage } from '~/modules/Shared/Domain/Pagination'
import { PostComment } from '~/modules/Posts/Domain/PostComment'
import { PostCommentRepositoryInterface } from '~/modules/Posts/Domain/PostCommentRepositoryInterface'

export class GetPostPostChildComments {
  // eslint-disable-next-line no-useless-constructor
  constructor (private repository: PostCommentRepositoryInterface) {}

  public async get (
    parentCommentId: PostComment['id'],
    page: number,
    perPage: number
  ): Promise<GetPostPostChildCommentsRespondeDto> {
    GetPostPostChildComments.validateRequest(page, perPage)

    const offset = (page - 1) * perPage

    const [postComments, childCommentsCount] = await Promise.all([
      await this.repository.findChildsWithOffsetAndLimit(
        parentCommentId,
        offset,
        perPage
      ),
      await this.repository.countPostChildComments(parentCommentId),
    ])

    const commentApplicationDtos: ChildCommentApplicationDto[] = postComments.map((comment) => {
      return ChildCommentApplicationDtoTranslator.fromDomain(comment)
    })

    return {
      childComments: commentApplicationDtos,
      childCommentsCount,
    }
  }

  private static validateRequest (page: number, perPage: number): void {
    if (isNaN(page) || page <= 0) {
      throw GetPostPostCommentsApplicationException.invalidPageValue()
    }

    if (
      isNaN(perPage) ||
      perPage < minPerPage ||
      perPage > maxPerPage
    ) {
      throw GetPostPostCommentsApplicationException.invalidPerPageValue(minPerPage, maxPerPage)
    }
  }
}
