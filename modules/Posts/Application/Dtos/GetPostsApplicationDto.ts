import {
  PostWithProducerAndMetaApplicationDto
} from '~/modules/Posts/Application/Dtos/PostWithProducerAndMetaApplicationDto'

export interface GetPostsApplicationDto {
  post: PostWithProducerAndMetaApplicationDto
  postViews: number
}

export interface GetPostsApplicationResponse {
  posts: GetPostsApplicationDto[]
  postsNumber: number
}
