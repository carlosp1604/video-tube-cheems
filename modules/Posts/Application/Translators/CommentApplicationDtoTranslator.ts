import { ChildCommentApplicationDtoTranslator } from './ChildCommentApplicationDtoTranslator'
import { CommentApplicationDto } from '~/modules/Posts/Application/Dtos/CommentApplicationDto'
import { PostComment } from '~/modules/Posts/Domain/PostComment'
import { UserApplicationDtoTranslator } from '~/modules/Auth/Application/Translators/UserApplicationDtoTranslator'

export class CommentApplicationDtoTranslator {
  public static fromDomain (comment: PostComment): CommentApplicationDto {
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
      userId: comment.userId,
    }
  }
}
