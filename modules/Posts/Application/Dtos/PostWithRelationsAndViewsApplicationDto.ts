import {
  PostWithRelationsApplicationDto
} from '~/modules/Posts/Application/Dtos/PostWithRelationsApplicationDto'

export interface PostWithRelationsAndViewsApplicationDto {
  readonly post: PostWithRelationsApplicationDto
  readonly postViews: number
}
