import { PostComment } from '../../Domain/PostComment'
import { CommentApplicationDto } from '../Dtos/CommentApplicationDto'
import { UserApplicationDtoTranslator } from '../../../Auth/Application/UserApplicationDtoTranslator'
import { ChildCommentApplicationDtoTranslator } from './ChildCommentApplicationDtoTranslator'

export class CommentApplicationDtoTranslator {
  public static fromDomain(comment: PostComment): CommentApplicationDto {
    return {
      id: comment.id,
      comment: comment.comment,
      createdAt: comment.createdAt.toISO(),
      updatedAt: comment.updatedAt.toISO(),
      childComments: comment.childComments.map((childComment) => {
        return ChildCommentApplicationDtoTranslator.fromDomain(childComment)
      }),
      postId: comment.postId,
      user: UserApplicationDtoTranslator.fromDomain(comment.user),
      userId: comment.userId
    }
  }
}