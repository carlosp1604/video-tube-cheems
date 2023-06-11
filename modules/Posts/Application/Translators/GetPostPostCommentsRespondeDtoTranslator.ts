import { CommentApplicationDtoTranslator } from './CommentApplicationDtoTranslator'
import { PostComment } from '~/modules/Posts/Domain/PostComment'
import { PostWithChildCommentCount } from '~/modules/Posts/Application/Dtos/GetPostPostCommentsResponseDto'

export class GetPostPostCommentsRespondeDtoTranslator {
  public static fromDomain (comment: PostComment, childComments: number): PostWithChildCommentCount {
    return {
      postComment: CommentApplicationDtoTranslator.fromDomain(comment),
      childComments,
    }
  }
}
