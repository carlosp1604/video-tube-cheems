import { GetPostsApplicationDto } from '~/modules/Posts/Application/GetPosts/GetPostsApplicationDto'

export interface GetRelatedPostsApplicationDto {
  posts: GetPostsApplicationDto[]
}
