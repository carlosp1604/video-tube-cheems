import { PostRepositoryInterface } from '~/modules/Posts/Domain/PostRepositoryInterface'
import {
  GetPostUserInteractionApplicationRequest
} from '~/modules/Posts/Application/GetPostUserInteraction/GetPostUserInteractionApplicationRequest'
import {
  PostReactionApplicationDtoTranslator
} from '~/modules/Posts/Application/Translators/PostReactionApplicationDtoTranslator'
import {
  GetPostUserInteractionApplicationDto
} from '~/modules/Posts/Application/GetPostUserInteraction/GetPostUserInteractionApplicationDto'

export class GetPostUserInteraction {
  // eslint-disable-next-line no-useless-constructor
  constructor (private readonly postRepository: PostRepositoryInterface) {}

  public async get (request: GetPostUserInteractionApplicationRequest): Promise<GetPostUserInteractionApplicationDto> {
    const postUserInteraction = await this.postRepository.findUserInteraction(request.postId, request.userId)

    return {
      userReaction: postUserInteraction.reaction
        ? PostReactionApplicationDtoTranslator.fromDomain(postUserInteraction.reaction)
        : null,
      savedPost: postUserInteraction.savedPost,
    }
  }
}
