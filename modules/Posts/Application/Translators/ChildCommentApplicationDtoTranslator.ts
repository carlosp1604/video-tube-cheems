import { UserApplicationDtoTranslator } from '../../../Auth/Application/UserApplicationDtoTranslator'
import { PostChildComment } from '../../Domain/PostChildComment'
import { ChildCommentApplicationDto } from '../Dtos/ChildCommentApplicationDto'

export class ChildCommentApplicationDtoTranslator {
  public static fromDomain(childComment: PostChildComment): ChildCommentApplicationDto {
    return {
      id: childComment.id,
      comment: childComment.comment,
      createdAt: childComment.createdAt.toISO(),
      updatedAt: childComment.updatedAt.toISO(),
      parentCommentId: childComment.parentCommentId,
      user: UserApplicationDtoTranslator.fromDomain(childComment.user),
      userId: childComment.userId
    }
  }
}