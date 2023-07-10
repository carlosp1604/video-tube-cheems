import { Post } from '~/modules/Posts/Domain/Post'

export interface GetPostPostCommentsApplicationRequest {
  readonly postId: Post['id']
  readonly page: number
  readonly perPage: number
}
