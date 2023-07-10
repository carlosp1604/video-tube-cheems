import { PostCommentApplicationDtoTranslator } from './PostCommentApplicationDtoTranslator'
import { PostComment } from '~/modules/Posts/Domain/PostComment'
import { PostWithChildCommentCountDto } from '~/modules/Posts/Application/Dtos/GetPostPostCommentsResponseDto'

export class PostWithChildCommentCountDtoTranslator {
  public static fromDomain (comment: PostComment, childrenNumber: number): PostWithChildCommentCountDto {
    return {
      postComment: PostCommentApplicationDtoTranslator.fromDomain(comment),
      childrenNumber,
    }
  }
}
