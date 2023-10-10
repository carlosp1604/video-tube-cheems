import { PostComment } from '~/modules/Posts/Domain/PostComments/PostComment'

export interface GetPostPostChildCommentsApplicationRequest {
  readonly parentCommentId: PostComment['id']
  readonly page: number
  readonly perPage: number
  readonly userId: string | null
}
