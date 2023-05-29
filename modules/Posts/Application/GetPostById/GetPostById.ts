import { GetPostByIdApplicationException } from './GetPostByIdApplicationException'
import { GetPostByIdApplicationResponseDto } from './GetPostByIdApplicationResponseDto'
import { PostRepositoryInterface } from '~/modules/Posts/Domain/PostRepositoryInterface'
import { GetPostByIdApplicationRequest } from '~/modules/Posts/Application/GetPostById/GetPostByIdApplicationRequest'
import { PostReaction } from '~/modules/Posts/Domain/PostReaction'
import {
  PostReactionApplicationDtoTranslator
} from '~/modules/Posts/Application/Translators/PostReactionApplicationDtoTranslator'
import { PostApplicationDtoTranslator } from '~/modules/Posts/Application/Translators/PostApplicationDtoTranslator'

export class GetPostById {
  // eslint-disable-next-line no-useless-constructor
  constructor (private readonly postRepository: PostRepositoryInterface) {}

  public async get (request: GetPostByIdApplicationRequest): Promise<GetPostByIdApplicationResponseDto> {
    const postWithCount = await this.postRepository.findByIdWithCount(request.postId)

    let userReaction: PostReaction | null = null

    if (request.userId !== null) {
      userReaction = await this.postRepository.findUserReaction(request.postId, request.userId)
    }

    if (postWithCount === null) {
      throw GetPostByIdApplicationException.postNotFound(request.postId)
    }

    return {
      post: PostApplicationDtoTranslator.fromDomain(postWithCount.post),
      reactions: postWithCount.postReactions,
      comments: postWithCount.postComments,
      views: postWithCount.postViews,
      userReaction: userReaction !== null ? PostReactionApplicationDtoTranslator.fromDomain(userReaction) : null,
    }
  }
}
