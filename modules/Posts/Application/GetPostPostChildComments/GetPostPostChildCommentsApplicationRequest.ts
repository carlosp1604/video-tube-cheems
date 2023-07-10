import { PostComment } from '~/modules/Posts/Domain/PostComment'

export interface GetPostPostChildCommentsApplicationRequest {
  readonly parentCommentId: PostComment['id']
  readonly page: number
  readonly perPage: number
}
