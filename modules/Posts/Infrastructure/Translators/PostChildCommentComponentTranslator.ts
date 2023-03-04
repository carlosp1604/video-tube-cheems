import { DateTime } from 'luxon'
import { DateService } from '../../../../helpers/Infrastructure/DateService'
import { ChildCommentApplicationDto } from '../../Application/Dtos/ChildCommentApplicationDto'
import { PostChildCommentComponentDto } from '../Dtos/PostChildCommentComponentDto'
import { UserPostCommentComponentDtoTranslator } from './UserPostCommentComponentTranslatorDto'

export class PostChildCommentComponentDtoTranslator {
  public static fromApplication(
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