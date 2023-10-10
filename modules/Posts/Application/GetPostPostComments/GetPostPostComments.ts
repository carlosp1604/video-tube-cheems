import { GetPostPostCommentsApplicationException } from './GetPostPostCommentsApplicationException'
import { PostCommentRepositoryInterface } from '~/modules/Posts/Domain/PostComments/PostCommentRepositoryInterface'
import { maxPerPage, minPerPage } from '~/modules/Shared/Domain/Pagination'
import {
  GetPostPostCommentsApplicationRequest
} from '~/modules/Posts/Application/GetPostPostComments/GetPostPostCommentsApplicationRequest'
import {
  GetPostPostCommentsResponseDto,
  PostWithChildCommentCountDto
} from '~/modules/Posts/Application/Dtos/GetPostPostCommentsResponseDto'
import {
  PostCommentApplicationDtoTranslator
} from '~/modules/Posts/Application/Translators/PostCommentApplicationDtoTranslator'
import { ReactionApplicationDtoTranslator } from '~/modules/Reactions/Application/ReactionApplicationDtoTranslator'

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
        request.perPage,
        request.userId
      ),
      await this.postCommentRepository.countPostComments(request.postId),
    ])

    const commentsWithChildCount: PostWithChildCommentCountDto[] = postComments.map((comment) => {
      return {
        postComment: PostCommentApplicationDtoTranslator.fromDomain(comment.postComment),
        childrenNumber: comment.childComments,
        reactionsNumber: comment.reactions,
        userReaction: comment.userReaction !== null
          ? ReactionApplicationDtoTranslator.fromDomain(comment.userReaction)
          : null,
      }
    })

    return {
      postCommentsWithChildrenCount: commentsWithChildCount,
      postPostCommentsCount,
    }
  }

  private static validateRequest (page: number, perPage: number): void {
    if (isNaN(page) || page <= 0) {
      throw GetPostPostCommentsApplicationException.invalidPageValue()
    }

    if (isNaN(perPage) || perPage < minPerPage || perPage > maxPerPage) {
      throw GetPostPostCommentsApplicationException.invalidPerPageValue(minPerPage, maxPerPage)
    }
  }
}
