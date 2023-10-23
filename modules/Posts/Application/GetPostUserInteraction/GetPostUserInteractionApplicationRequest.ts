import { Post } from '~/modules/Posts/Domain/Post'
import { User } from '~/modules/Auth/Domain/User'

export interface GetPostUserInteractionApplicationRequest {
  postId: Post['id']
  userId: User['id']
}
