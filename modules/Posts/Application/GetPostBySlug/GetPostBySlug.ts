import { GetPostBySlugApplicationException } from './GetPostBySlugApplicationException'
import { GetPostBySlugApplicationResponseDto } from './GetPostBySlugApplicationResponseDto'
import { PostRepositoryInterface } from '~/modules/Posts/Domain/PostRepositoryInterface'
import {
  GetPostBySlugApplicationRequest
} from '~/modules/Posts/Application/GetPostBySlug/GetPostBySlugApplicationRequest'
import { PostApplicationDtoTranslator } from '~/modules/Posts/Application/Translators/PostApplicationDtoTranslator'
import { Post } from '~/modules/Posts/Domain/Post'

export class GetPostBySlug {
  // eslint-disable-next-line no-useless-constructor
  constructor (private readonly postRepository: PostRepositoryInterface) {}

  public async get (request: GetPostBySlugApplicationRequest): Promise<GetPostBySlugApplicationResponseDto> {
    const postWithCount = await this.postRepository.findBySlugWithCount(request.slug)

    if (postWithCount === null) {
      throw GetPostBySlugApplicationException.postNotFound(request.slug)
    }

    const externalLink = this.getExternalLink(postWithCount.post)

    return {
      post: PostApplicationDtoTranslator.fromDomain(postWithCount.post),
      reactions: postWithCount.reactions,
      comments: postWithCount.postComments,
      views: postWithCount.postViews,
      externalLink,
    }
  }

  public getExternalLink (post: Post): string | null {
    const redirectionMeta = post.meta.find((meta) => meta.type === 'external-link')

    if (redirectionMeta) {
      return redirectionMeta.value
    }

    return null
  }
}
