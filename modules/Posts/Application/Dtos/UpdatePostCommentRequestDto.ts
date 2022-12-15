import { User } from '../../../Auth/Domain/User'
import { Post } from '../../Domain/Post'
import { PostComment } from '../../Domain/PostComment'

export interface UpdatePostCommentRequestDto {
  readonly postId: Post['id']
  readonly postCommentId: PostComment['id'] 
  readonly postParentId: PostComment['parentCommentId'] | null
  readonly comment: PostComment['comment']
  readonly userId: User['id']
}