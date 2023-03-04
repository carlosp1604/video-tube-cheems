import { DateTime } from 'luxon'
import { DateService } from '../../../../helpers/Infrastructure/DateService'
import { PostWithChildComment } from '../../Application/Dtos/GetPostPostCommentsResponseDto'
import { PostCommentComponentDto } from '../Dtos/PostCommentComponentDto'

export class PostCommentComponentDtoTranslator {
  public static fromApplication(
    applicationDto: PostWithChildComment,
    locale: string
  ): PostCommentComponentDto {

    return {
      id: applicationDto.postComment.id,
      postId: applicationDto.postComment.postId,
      comment: applicationDto.postComment.comment,
      parentCommentId: applicationDto.postComment.parentCommentId,
      createdAt: new DateService()
        .formatAgoLike(DateTime.fromISO(applicationDto.postComment.createdAt), locale),
      user: {
        id: applicationDto.postComment.user.id,
        name: applicationDto.postComment.user.name,
        imageUrl: applicationDto.postComment.user.imageUrl
      },
      repliesNumber: applicationDto.childComments
    }
  }
    
}