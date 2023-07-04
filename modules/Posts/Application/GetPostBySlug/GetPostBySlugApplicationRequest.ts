import { Post } from '~/modules/Posts/Domain/Post'

export interface GetPostBySlugApplicationRequest {
  readonly slug: Post['slug']
}
