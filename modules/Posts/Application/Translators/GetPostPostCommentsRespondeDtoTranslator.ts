import { PostComment } from '../../Domain/PostComment'
import { PostWithChildCommentCount } from '../Dtos/GetPostPostCommentsResponseDto'
import { CommentApplicationDtoTranslator } from './CommentApplicationDtoTranslator'

export class GetPostPostCommentsRespondeDtoTranslator {
  public static fromDomain(comment: PostComment, childComments: number): PostWithChildCommentCount {
    return {
      postComment: CommentApplicationDtoTranslator.fromDomain(comment),
      childComments,
    }
  }
}