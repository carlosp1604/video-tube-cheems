import { DateTime } from 'luxon'
import { PostWithChildCommentCount } from '~/modules/Posts/Application/Dtos/GetPostPostCommentsResponseDto'
import { PostCommentComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCommentComponentDto'
import { DateService } from '~/helpers/Infrastructure/DateService'

export class PostCommentComponentDtoTranslator {
  public static fromApplication (
    applicationDto: PostWithChildCommentCount,
    locale: string
  ): PostCommentComponentDto {
    return {
      id: applicationDto.postComment.id,
      postId: applicationDto.postComment.postId,
      comment: applicationDto.postComment.comment,
      createdAt: new DateService()
        .formatAgoLike(DateTime.fromISO(applicationDto.postComment.createdAt), locale),
      user: {
        id: applicationDto.postComment.user.id,
        name: applicationDto.postComment.user.name,
        imageUrl: applicationDto.postComment.user.imageUrl,
      },
      repliesNumber: applicationDto.childComments,
    }
  }
}
