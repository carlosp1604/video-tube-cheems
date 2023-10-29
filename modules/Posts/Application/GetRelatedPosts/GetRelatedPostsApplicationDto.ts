import { GetPostsApplicationDto } from '~/modules/Posts/Application/Dtos/GetPostsApplicationDto'

export interface GetRelatedPostsApplicationDto {
  posts: GetPostsApplicationDto[]
}
