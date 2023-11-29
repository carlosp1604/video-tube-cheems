import {
  PostWithRelationsAndViewsApplicationDto
} from '~/modules/Posts/Application/Dtos/PostWithRelationsAndViewsApplicationDto'

export interface GetPostsApplicationResponse {
  posts: PostWithRelationsAndViewsApplicationDto[]
  postsNumber: number
}
