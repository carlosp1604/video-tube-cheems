import { DateTime } from 'luxon'
import { UserPostCommentComponentDtoTranslator } from './UserPostCommentComponentTranslatorDto'
import { ChildCommentApplicationDto } from '~/modules/Posts/Application/Dtos/ChildCommentApplicationDto'
import { PostChildCommentComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostChildCommentComponentDto'
import { DateService } from '~/helpers/Infrastructure/DateService'

export class PostChildCommentComponentDtoTranslator {
  public static fromApplication (
    applicationDto: ChildCommentApplicationDto,
    locale: string
  ): PostChildCommentComponentDto {
    return {
      id: applicationDto.id,
      comment: applicationDto.comment,
      createdAt: new DateService()
        .formatAgoLike(DateTime.fromISO(applicationDto.createdAt), locale),
      user: UserPostCommentComponentDtoTranslator.fromApplication(applicationDto.user),
      parentCommentId: applicationDto.parentCommentId,

    }
  }
}
