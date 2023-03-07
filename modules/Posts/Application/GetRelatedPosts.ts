import { PostRepositoryInterface } from '../Domain/PostRepositoryInterface'
import { Post } from '../Domain/Post'
import { GetRelatedPostsApplicationResponseTranslator } from './Translators/GetRelatedPostsApplicationResponseTranslator'
import { GetRelatedPostsApplicationResponse } from './Dtos/GetRelatedPostsApplicationResponse'

export class GetRelatedPosts {
  constructor(
    private readonly postRepository: PostRepositoryInterface
  ) {}

  public async get(postId: Post['id']): Promise<GetRelatedPostsApplicationResponse> {
    const relatedPosts = await this.postRepository.getRelatedPosts(postId)

    return GetRelatedPostsApplicationResponseTranslator.fromDomain(
      relatedPosts
    )
  }
}