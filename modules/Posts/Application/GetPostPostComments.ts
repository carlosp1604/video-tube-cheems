import { GetPostPostCommentsResponseDto, PostWithChildCommentCount } from './Dtos/GetPostPostCommentsResponseDto'
import { GetPostPostCommentsApplicationException } from './GetPostPostCommentsApplicationException'
import { GetPostPostCommentsRespondeDtoTranslator } from './Translators/GetPostPostCommentsRespondeDtoTranslator'
import { Post } from '~/modules/Posts/Domain/Post'
import { PostCommentRepositoryInterface } from '~/modules/Posts/Domain/PostCommentRepositoryInterface'
import { maxPerPage, minPerPage } from '~/modules/Shared/Domain/Pagination'

export class GetPostPostComments {
  // eslint-disable-next-line no-useless-constructor
  constructor (private repository: PostCommentRepositoryInterface) {}

  public async get (
    postId: Post['id'],
    page: number,
    perPage: number
  ): Promise<GetPostPostCommentsResponseDto> {
    GetPostPostComments.validateRequest(page, perPage)

    const offset = (page - 1) * perPage

    const [postComments, postPostCommentsCount] = await Promise.all([
      await this.repository.findWithOffsetAndLimit(
        postId,
        offset,
        perPage
      ),
      await this.repository.countPostComments(postId),
    ])

    const commentsWithChildCount: PostWithChildCommentCount[] = postComments.map((comment) => {
      return GetPostPostCommentsRespondeDtoTranslator.fromDomain(comment.postComment, comment.childComments)
    })

    return {
      commentWithChildCount: commentsWithChildCount,
      postPostCommentsCount,
    }
  }

  private static validateRequest (page: number, perPage: number): void {
    if (isNaN(page) || page <= 0) {
      throw GetPostPostCommentsApplicationException.invalidOffsetValue()
    }

    if (
      isNaN(perPage) ||
      perPage < minPerPage ||
      perPage > maxPerPage
    ) {
      throw GetPostPostCommentsApplicationException.invalidLimitValue(minPerPage, maxPerPage)
    }
  }
}
