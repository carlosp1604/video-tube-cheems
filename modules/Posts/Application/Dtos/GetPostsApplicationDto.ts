import { PostApplicationDto } from './PostApplicationDto'

export interface GetPostsApplicationDto {
  post: PostApplicationDto
  postReactions: number
  postComments: number
}

export interface GetPostsApplicationResponse {
  posts: GetPostsApplicationDto[],
  postsNumber: number
}