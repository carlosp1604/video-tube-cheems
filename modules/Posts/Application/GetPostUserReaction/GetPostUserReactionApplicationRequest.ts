import { Post } from '~/modules/Posts/Domain/Post'
import { User } from '~/modules/Auth/Domain/User'

export interface GetPostUserReactionApplicationRequest {
  postId: Post['id']
  userId: User['id']
}
