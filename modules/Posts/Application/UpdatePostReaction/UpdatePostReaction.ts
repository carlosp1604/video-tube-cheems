import { ModelReactionApplicationDto } from '~/modules/Reactions/Application/ModelReactionApplicationDto'
import { ReactionApplicationDtoTranslator } from '~/modules/Reactions/Application/ReactionApplicationDtoTranslator'
import { UpdatePostReactionRequestDto } from '../Dtos/UpdatePostReactionRequestDto'
import { UpdatePostReactionApplicationException } from './UpdatePostReactionApplicationException'
import { UserRepositoryInterface } from '~/modules/Auth/Domain/UserRepositoryInterface'
import { PostRepositoryInterface, RepositoryOptions } from '~/modules/Posts/Domain/PostRepositoryInterface'
import { ReactionableModelDomainException } from '~/modules/Reactions/Domain/ReactionableModelDomainException'
import { Post } from '~/modules/Posts/Domain/Post'

export class UpdatePostReaction {
  private options: RepositoryOptions[] = ['reactions', 'reactions.user']

  // eslint-disable-next-line no-useless-constructor
  constructor (
    private readonly postRepository: PostRepositoryInterface,
    private readonly userRepository: UserRepositoryInterface
  ) {}

  public async update (
    request: UpdatePostReactionRequestDto
  ): Promise<ModelReactionApplicationDto> {
    const post = await this.postRepository.findById(request.postId, this.options) as Post

    if (post === null) {
      throw UpdatePostReactionApplicationException.postNotFound(request.postId)
    }

    const user = await this.userRepository.findById(request.userId)

    if (user === null) {
      throw UpdatePostReactionApplicationException.userNotFound(request.userId)
    }

    try {
      const reaction = post.updatePostReaction(request.userId, request.reactionType)

      await this.postRepository.updateReaction(reaction)

      return ReactionApplicationDtoTranslator.fromDomain(reaction)
    } catch (exception: unknown) {
      if (!(exception instanceof ReactionableModelDomainException)) {
        throw exception
      }

      switch (exception.id) {
        case ReactionableModelDomainException.userHasNotReactedId:
          throw UpdatePostReactionApplicationException.userHasNotReacted(request.userId, request.postId)

        default:
          throw UpdatePostReactionApplicationException.cannotUpdateReaction(request.userId, request.postId)
      }
    }
  }
}
