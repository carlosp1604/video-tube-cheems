import { PostChildComment } from '~/modules/Posts/Domain/PostChildComment'
import { ChildCommentApplicationDto } from '~/modules/Posts/Application/Dtos/ChildCommentApplicationDto'
import { UserApplicationDtoTranslator } from '~/modules/Auth/Application/Translators/UserApplicationDtoTranslator'

export class ChildCommentApplicationDtoTranslator {
  public static fromDomain (childComment: PostChildComment): ChildCommentApplicationDto {
    return {
      id: childComment.id,
      comment: childComment.comment,
      createdAt: childComment.createdAt.toISO(),
      updatedAt: childComment.updatedAt.toISO(),
      parentCommentId: childComment.parentCommentId,
      user: UserApplicationDtoTranslator.fromDomain(childComment.user),
      userId: childComment.userId,
    }
  }
}
