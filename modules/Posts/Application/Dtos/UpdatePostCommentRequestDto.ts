import { Post } from '~/modules/Posts/Domain/Post'
import { PostComment } from '~/modules/Posts/Domain/PostComment'
import { User } from '~/modules/Auth/Domain/User'

export interface UpdatePostCommentRequestDto {
  readonly postId: Post['id']
  readonly postCommentId: PostComment['id']
  readonly comment: PostComment['comment']
  readonly userId: User['id']
}
