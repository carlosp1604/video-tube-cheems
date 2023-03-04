import { PostComment } from '@prisma/client'
import { maxPostsPerPage, minPostsPerPage } from '../../Shared/Application/Pagination'
import { Post } from '../Domain/Post'
import { PostCommentRepositoryInterface } from '../Domain/PostCommentRepositoryInterface'
import { PostWithChildComment } from './Dtos/GetPostPostCommentsResponseDto'
import { GetPostPostCommentsApplicationException } from './GetPostPostCommentsApplicationException'
import { GetPostPostCommentsRespondeDtoTranslator } from './Translators/GetPostPostCommentsRespondeDtoTranslator'

export class GetPostPostComments {
  constructor(private repository: PostCommentRepositoryInterface) {}

  public async get(
    postId: Post['id'],
    page: number,
    perPage: number,
    parentCommentId: PostComment['parentCommentId']
  ) {
    this.validateRequest(page, perPage)

    const offset = (page - 1) * perPage

    const [postComments, postPostComments] = await Promise.all([
      await this.repository.findWithOffsetAndLimit(
        postId,
        offset,
        perPage,
        parentCommentId
      ),
      await this.repository.countPostsWithFilters(postId, parentCommentId)
    ])

    console.log(postComments)

    const commentsWithChildCount: PostWithChildComment[] = postComments.map((comment) => {
      return GetPostPostCommentsRespondeDtoTranslator.fromDomain(comment.postComment, comment.childComments)
    })

    return {
      commentwithChildComment: commentsWithChildCount,
      postPostComments,
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