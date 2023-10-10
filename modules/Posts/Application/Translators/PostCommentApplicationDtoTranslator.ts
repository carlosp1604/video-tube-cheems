import { PostCommentApplicationDto } from '~/modules/Posts/Application/Dtos/PostCommentApplicationDto'
import { PostComment } from '~/modules/Posts/Domain/PostComments/PostComment'
import { UserApplicationDtoTranslator } from '~/modules/Auth/Application/Translators/UserApplicationDtoTranslator'

export class PostCommentApplicationDtoTranslator {
  public static fromDomain (comment: PostComment): PostCommentApplicationDto {
    return {
      id: comment.id,
      comment: comment.comment,
      createdAt: comment.createdAt.toISO(),
      updatedAt: comment.updatedAt.toISO(),
      postId: comment.postId,
      user: UserApplicationDtoTranslator.fromDomain(comment.user),
      userId: comment.userId,
    }
  }
}
