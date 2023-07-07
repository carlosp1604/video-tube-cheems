import { Post } from '~/modules/Posts/Domain/Post'
import { PostRepositoryInterface } from '~/modules/Posts/Domain/PostRepositoryInterface'
import { GetRelatedPostsApplicationDto } from './GetRelatedPostsApplicationDto'
import { GetRelatedPostsApplicationDtoTranslator } from './GetRelatedPostsApplicationDtoTranslator'

export class GetRelatedPosts {
  // eslint-disable-next-line no-useless-constructor
  constructor (private readonly postRepository: PostRepositoryInterface) {}

  public async get (postId: Post['id']): Promise<GetRelatedPostsApplicationDto> {
    const relatedPosts = await this.postRepository.getRelatedPosts(postId)

    return GetRelatedPostsApplicationDtoTranslator.fromDomain(relatedPosts)
  }
}
