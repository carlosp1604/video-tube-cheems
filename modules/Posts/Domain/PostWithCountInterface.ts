import { Post } from './Post'

export interface PostWithViewsCommentsReactionsInterface {
  post: Post
  postViews: number
}

export interface PostWithViewsInterface {
  post: Post
  postViews: number
}

export interface PostsWithViewsInterfaceWithTotalCount {
  posts: PostWithViewsInterface[]
  count: number
}
