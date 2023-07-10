import { maxPerPage, minPerPage } from '~/modules/Shared/Domain/Pagination'
import { PostCommentRepositoryInterface } from '~/modules/Posts/Domain/PostCommentRepositoryInterface'
import {
  GetPostPostChildCommentsApplicationRequest
} from '~/modules/Posts/Application/GetPostPostChildComments/GetPostPostChildCommentsApplicationRequest'
import {
  GetPostPostChildCommentsApplicationException
} from '~/modules/Posts/Application/GetPostPostChildComments/GetPostPostChildCommentsApplicationException'
import {
  GetPostPostChildCommentsResponseDto
} from '~/modules/Posts/Application/Dtos/GetPostPostChildCommentsResponseDto'
import { PostChildCommentApplicationDto } from '~/modules/Posts/Application/Dtos/PostChildCommentApplicationDto'
import {
  PostChildCommentApplicationDtoTranslator
} from '~/modules/Posts/Application/Translators/PostChildCommentApplicationDtoTranslator'

export class GetPostPostChildComments {
  // eslint-disable-next-line no-useless-constructor
  constructor (private postCommentRepository: PostCommentRepositoryInterface) {}

  public async get (request: GetPostPostChildCommentsApplicationRequest): Promise<GetPostPostChildCommentsResponseDto> {
    GetPostPostChildComments.validateRequest(request.page, request.perPage)

    const offset = (request.page - 1) * request.perPage

    const [postComments, childCommentsCount] = await Promise.all([
      await this.postCommentRepository.findChildsWithOffsetAndLimit(
        request.parentCommentId,
        offset,
        request.perPage
      ),
      await this.postCommentRepository.countPostChildComments(request.parentCommentId),
    ])

    const commentApplicationDtos: PostChildCommentApplicationDto[] = postComments.map((comment) => {
      return PostChildCommentApplicationDtoTranslator.fromDomain(comment)
    })

    return {
      childComments: commentApplicationDtos,
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
