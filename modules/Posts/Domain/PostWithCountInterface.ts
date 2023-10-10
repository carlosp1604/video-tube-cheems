import { Post } from './Post'

export interface PostReactionsInterface {
  like: number
  dislike: number
}

export interface PostWithViewsCommentsReactionsInterface {
  post: Post
  postComments: number
  postViews: number
  reactions: PostReactionsInterface
}

export interface PostWithViewsInterface {
  post: Post
  postViews: number
}
