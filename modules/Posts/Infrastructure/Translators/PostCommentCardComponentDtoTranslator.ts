import { UserPostCommentComponentDtoTranslator } from './UserPostCommentComponentTranslatorDto'
import { UserApplicationDto } from '~/modules/Auth/Application/Dtos/UserApplicationDto'
import { PostCommentCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCommentCardComponentDto'
import { DateService } from '~/helpers/Infrastructure/DateService'

export class PostCommentCardComponentDtoTranslator {
  public static translate (
    id: string,
    comment: string,
    createdAt: string,
    userApplicationDto: UserApplicationDto,
    locale: string
  ): PostCommentCardComponentDto {
    return {
      id,
      comment,
      createdAt: new DateService()
        .formatAgoLike(new Date(createdAt), locale),
      user: UserPostCommentComponentDtoTranslator.fromApplication(userApplicationDto),
    }
  }
}
