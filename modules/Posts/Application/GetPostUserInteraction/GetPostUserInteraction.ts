import { PostRepositoryInterface } from '~/modules/Posts/Domain/PostRepositoryInterface'
import {
  GetPostUserInteractionApplicationRequest
} from '~/modules/Posts/Application/GetPostUserInteraction/GetPostUserInteractionApplicationRequest'
import {
  PostReactionApplicationDtoTranslator
} from '~/modules/Posts/Application/Translators/PostReactionApplicationDtoTranslator'
import {
  GetPostUserInteractionApplicationResponseDto
} from '~/modules/Posts/Application/GetPostUserInteraction/GetPostUserInteractionApplicationResponseDto'

export class GetPostUserInteraction {
  // eslint-disable-next-line no-useless-constructor
  constructor (private readonly postRepository: PostRepositoryInterface) {}

  public async get (request: GetPostUserInteractionApplicationRequest): Promise<GetPostUserInteractionApplicationResponseDto> {
    const postUserInteraction = await this.postRepository.findUserInteraction(request.postId, request.userId)

    return {
      userReaction: postUserInteraction.reaction
        ? PostReactionApplicationDtoTranslator.fromDomain(postUserInteraction.reaction)
        : null,
      savedPost: postUserInteraction.savedPost,
    }
  }
}
