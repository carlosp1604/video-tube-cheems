import { Post } from '~/modules/Posts/Domain/Post'
import { PostComment } from '~/modules/Posts/Domain/PostComment'
import { User } from '~/modules/Auth/Domain/User'

export interface DeletePostCommentRequestDto {
  readonly postId: Post['id']
  readonly postCommentId: PostComment['id']
  // FIXME:
  readonly postParentId: string | null
  readonly userId: User['id']
}
