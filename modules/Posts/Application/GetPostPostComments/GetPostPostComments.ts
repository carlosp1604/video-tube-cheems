import { GetPostPostCommentsResponseDto, PostWithChildCommentCountDto } from '../Dtos/GetPostPostCommentsResponseDto'
import { GetPostPostCommentsApplicationException } from './GetPostPostCommentsApplicationException'
import { PostCommentRepositoryInterface } from '~/modules/Posts/Domain/PostCommentRepositoryInterface'
import { maxPerPage, minPerPage } from '~/modules/Shared/Domain/Pagination'
import {
  PostWithChildCommentCountDtoTranslator
} from '~/modules/Posts/Application/Translators/PostWithChildCommentCountDtoTranslator'
import {
  GetPostPostCommentsApplicationRequest
} from '~/modules/Posts/Application/GetPostPostComments/GetPostPostCommentsApplicationRequest'

export class GetPostPostComments {
  // eslint-disable-next-line no-useless-constructor
  constructor (private postCommentRepository: PostCommentRepositoryInterface) {}

  public async get (request: GetPostPostCommentsApplicationRequest): Promise<GetPostPostCommentsResponseDto> {
    GetPostPostComments.validateRequest(request.page, request.perPage)

    const offset = (request.page - 1) * request.perPage

    const [postComments, postPostCommentsCount] = await Promise.all([
      await this.postCommentRepository.findWithOffsetAndLimit(
        request.postId,
        offset,
        request.perPage
      ),
      await this.postCommentRepository.countPostComments(request.postId),
    ])

    const commentsWithChildCount: PostWithChildCommentCountDto[] = postComments.map((comment) => {
      return PostWithChildCommentCountDtoTranslator.fromDomain(comment.postComment, comment.childComments)
    })

    return {
      postCommentsWithChildrenCount: commentsWithChildCount,
      postPostCommentsCount,
    }
  }

  private static validateRequest (page: number, perPage: number): void {
    if (isNaN(page) || page <= 0) {
      throw GetPostPostCommentsApplicationException.invalidOffsetValue()
    }

    if (isNaN(perPage) || perPage < minPerPage || perPage > maxPerPage) {
      throw GetPostPostCommentsApplicationException.invalidLimitValue(minPerPage, maxPerPage)
    }
  }
}
