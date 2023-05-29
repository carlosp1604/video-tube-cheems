import { Post } from './Post'

export interface PostWithCountInterface {
  post: Post
  postReactions: number
  postComments: number
  postViews: number
}
