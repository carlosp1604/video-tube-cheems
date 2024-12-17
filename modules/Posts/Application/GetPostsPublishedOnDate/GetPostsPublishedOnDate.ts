import { PostRepositoryInterface } from '~/modules/Posts/Domain/PostRepositoryInterface'
import { PostWithRelationsApplicationDto } from '~/modules/Posts/Application/Dtos/PostWithRelationsApplicationDto'
import { PostWithRelationsDtoTranslator } from '~/modules/Posts/Application/Translators/PostWithRelationsDtoTranslator'

export class GetPostsPublishedOnDate {
  // eslint-disable-next-line no-useless-constructor
  constructor (private readonly postRepository: PostRepositoryInterface) {}

  public async get (publishedDate: Date): Promise<PostWithRelationsApplicationDto[]> {
    const posts = await this.postRepository.getPostsPublishedOnDate(publishedDate)

    return posts.map((post) => PostWithRelationsDtoTranslator.fromDomain(post))
  }
}
