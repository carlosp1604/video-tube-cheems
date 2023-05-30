import { PostApplicationDto } from '../Dtos/PostApplicationDto'

export interface GetPostsApplicationDto {
  post: PostApplicationDto
  postReactions: number
  postComments: number
  postViews: number
}

export interface GetPostsApplicationResponse {
  posts: GetPostsApplicationDto[]
  postsNumber: number
}
