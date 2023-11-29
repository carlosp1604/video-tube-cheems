import {
  PostWithRelationsAndViewsApplicationDto
} from '~/modules/Posts/Application/Dtos/PostWithRelationsAndViewsApplicationDto'

export interface GetRelatedPostsApplicationDto {
  posts: PostWithRelationsAndViewsApplicationDto[]
}
