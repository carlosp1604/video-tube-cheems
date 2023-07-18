import { Post } from '~/modules/Posts/Domain/Post'
import { PostComment } from '~/modules/Posts/Domain/PostComment'
import { User } from '~/modules/Auth/Domain/User'

export interface DeletePostCommentApplicationRequestDto {
  readonly postId: Post['id']
  readonly postCommentId: PostComment['id']
  readonly parentCommentId: PostComment['id'] | null
  readonly userId: User['id']
}
