import { maxPerPage, minPerPage } from '~/modules/Shared/Domain/Pagination'
import { PostCommentRepositoryInterface } from '~/modules/Posts/Domain/PostComments/PostCommentRepositoryInterface'
import {
  GetPostPostChildCommentsApplicationRequest
} from '~/modules/Posts/Application/GetPostPostChildComments/GetPostPostChildCommentsApplicationRequest'
import {
  GetPostPostChildCommentsApplicationException
} from '~/modules/Posts/Application/GetPostPostChildComments/GetPostPostChildCommentsApplicationException'
import {
  GetPostPostChildCommentsResponseDto, PostChildCommentWithReactionsApplicationDto
} from '~/modules/Posts/Application/GetPostPostChildComments/GetPostPostChildCommentsResponseDto'
import {
  PostChildCommentApplicationDtoTranslator
} from '~/modules/Posts/Application/Translators/PostChildCommentApplicationDtoTranslator'
import { ReactionApplicationDtoTranslator } from '~/modules/Reactions/Application/ReactionApplicationDtoTranslator'

export class GetPostPostChildComments {
  // eslint-disable-next-line no-useless-constructor
  constructor (private postCommentRepository: PostCommentRepositoryInterface) {}

  public async get (request: GetPostPostChildCommentsApplicationRequest): Promise<GetPostPostChildCommentsResponseDto> {
    GetPostPostChildComments.validateRequest(request.page, request.perPage)

    const offset = (request.page - 1) * request.perPage

    const [postComments, childCommentsCount] = await Promise.all([
      await this.postCommentRepository.findChildWithOffsetAndLimit(
        request.parentCommentId,
        offset,
        request.perPage,
        request.userId
      ),
      await this.postCommentRepository.countPostChildComments(request.parentCommentId),
    ])

    const childCommentsWithReactions: PostChildCommentWithReactionsApplicationDto[] = postComments.map((comment) => {
      return {
        postChildComment: PostChildCommentApplicationDtoTranslator.fromDomain(comment.postChildComment),
        reactionsNumber: comment.reactions,
        userReaction: comment.userReaction !== null
          ? ReactionApplicationDtoTranslator.fromDomain(comment.userReaction)
          : null,
      }
    })

    return {
      childCommentsWithReactions,
      childCommentsCount,
    }
  }

  private static validateRequest (page: number, perPage: number): void {
    if (isNaN(page) || page <= 0) {
      throw GetPostPostChildCommentsApplicationException.invalidPageValue()
    }

    if (isNaN(perPage) || perPage < minPerPage || perPage > maxPerPage) {
      throw GetPostPostChildCommentsApplicationException.invalidPerPageValue(minPerPage, maxPerPage)
    }
  }
}
