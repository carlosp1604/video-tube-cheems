import { PostRepositoryInterface } from '~/modules/Posts/Domain/PostRepositoryInterface'
import {
  GetPostUserReactionApplicationRequest
} from '~/modules/Posts/Application/GetPostUserReaction/GetPostUserReactionApplicationRequest'
import { ModelReactionApplicationDto } from '~/modules/Reactions/Application/ModelReactionApplicationDto'
import {
  PostReactionApplicationDtoTranslator
} from '~/modules/Posts/Application/Translators/PostReactionApplicationDtoTranslator'

export class GetPostUserReaction {
  // eslint-disable-next-line no-useless-constructor
  constructor (private readonly postRepository: PostRepositoryInterface) {}

  public async get (request: GetPostUserReactionApplicationRequest): Promise<ModelReactionApplicationDto | null> {
    const postUserReaction = await this.postRepository.findUserReaction(request.postId, request.userId)

    if (postUserReaction === null) {
      return null
    }

    return PostReactionApplicationDtoTranslator.fromDomain(postUserReaction)
  }
}
