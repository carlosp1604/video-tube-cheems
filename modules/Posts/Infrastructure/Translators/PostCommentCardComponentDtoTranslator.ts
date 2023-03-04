import { DateTime } from 'luxon'
import { DateService } from '../../../../helpers/Infrastructure/DateService'
import { UserApplicationDto } from '../../../Auth/Application/UserApplicationDto'
import { PostCommentCardComponentDto } from '../Dtos/PostCommentCardComponentDto'
import { UserPostCommentComponentDtoTranslator } from './UserPostCommentComponentTranslatorDto'

export class PostCommentCardComponentDtoTranslator {
  public static translate(
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
        .formatAgoLike(DateTime.fromISO(createdAt), locale),
      user: UserPostCommentComponentDtoTranslator.fromApplication(userApplicationDto)
    }
  }
    
}