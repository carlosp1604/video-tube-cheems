import { GetPostsApplicationDto } from '~/modules/Posts/Application/GetPosts/GetPostsApplicationDto'

export interface GetRelatedPostsApplicationResponse {
  posts: GetPostsApplicationDto[]
}
