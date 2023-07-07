import { UserPostCommentComponentDtoTranslator } from './UserPostCommentComponentTranslatorDto'
import { PostChildCommentApplicationDto } from '~/modules/Posts/Application/Dtos/PostChildCommentApplicationDto'
import { PostChildCommentComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostChildCommentComponentDto'
import { DateService } from '~/helpers/Infrastructure/DateService'

export class PostChildCommentComponentDtoTranslator {
  public static fromApplication (
    applicationDto: PostChildCommentApplicationDto,
    locale: string
  ): PostChildCommentComponentDto {
    return {
      id: applicationDto.id,
      comment: applicationDto.comment,
      createdAt: new DateService()
        .formatAgoLike(new Date(applicationDto.createdAt), locale),
      user: UserPostCommentComponentDtoTranslator.fromApplication(applicationDto.user),
      parentCommentId: applicationDto.parentCommentId,

    }
  }
}
