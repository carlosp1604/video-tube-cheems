import { PostComment } from '../../Domain/PostComment'
import { PostWithChildComment } from '../Dtos/GetPostPostCommentsResponseDto'
import { CommentApplicationDtoTranslator } from './CommentApplicationDtoTranslator'

export class GetPostPostCommentsRespondeDtoTranslator {
  public static fromDomain(comment: PostComment, childComments: number): PostWithChildComment {
    return {
      postComment: CommentApplicationDtoTranslator.fromDomain(comment),
      childComments,
    }
  }
}