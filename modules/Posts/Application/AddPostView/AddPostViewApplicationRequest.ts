import { User } from 'next-auth'
import { Post } from '~/modules/Posts/Domain/Post'

export interface AddPostViewApplicationRequest {
  userId: User['id'] | null
  postId: Post['id']
}
