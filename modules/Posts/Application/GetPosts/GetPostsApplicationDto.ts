import {
  PostWithProducerAndMetaApplicationDto
} from '~/modules/Posts/Application/Dtos/PostWithProducerAndMetaApplicationDto'

export interface GetPostsApplicationDto {
  post: PostWithProducerAndMetaApplicationDto
  postReactions: number
  postComments: number
  postViews: number
}

export interface GetPostsApplicationResponse {
  posts: GetPostsApplicationDto[]
  postsNumber: number
}
