import { GetPostBySlugApplicationException } from './GetPostBySlugApplicationException'
import { GetPostBySlugApplicationResponseDto } from './GetPostBySlugApplicationResponseDto'
import { PostRepositoryInterface } from '~/modules/Posts/Domain/PostRepositoryInterface'
import { GetPostBySlugApplicationRequest } from '~/modules/Posts/Application/GetPostBySlug/GetPostBySlugApplicationRequest'
import { PostApplicationDtoTranslator } from '~/modules/Posts/Application/Translators/PostApplicationDtoTranslator'

export class GetPostBySlug {
  // eslint-disable-next-line no-useless-constructor
  constructor (private readonly postRepository: PostRepositoryInterface) {}

  public async get (request: GetPostBySlugApplicationRequest): Promise<GetPostBySlugApplicationResponseDto> {
    const postWithCount = await this.postRepository.findBySlugWithCount(request.slug)

    if (postWithCount === null) {
      throw GetPostBySlugApplicationException.postNotFound(request.slug)
    }

    return {
      post: PostApplicationDtoTranslator.fromDomain(postWithCount.post),
      reactions: postWithCount.postReactions,
      comments: postWithCount.postComments,
      views: postWithCount.postViews,
    }
  }
}
