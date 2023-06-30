import { Post } from '~/modules/Posts/Domain/Post'
import { PostRepositoryInterface } from '~/modules/Posts/Domain/PostRepositoryInterface'
import { GetRelatedPostsApplicationResponse } from './GetRelatedPostsApplicationResponse'
import { GetRelatedPostsApplicationResponseTranslator } from './GetRelatedPostsApplicationResponseTranslator'

export class GetRelatedPosts {
  // eslint-disable-next-line no-useless-constructor
  constructor (private readonly postRepository: PostRepositoryInterface) {}

  public async get (postId: Post['id']): Promise<GetRelatedPostsApplicationResponse> {
    const relatedPosts = await this.postRepository.getRelatedPosts(postId)

    return GetRelatedPostsApplicationResponseTranslator.fromDomain(relatedPosts)
  }
}
