import { Post } from '~/modules/Posts/Domain/Post'

export interface GetPostByIdApplicationRequest {
  postId: Post['id']
}
