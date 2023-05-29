import { ReactionApplicationDto } from './Dtos/ReactionApplicationDto'
import { ReactionApplicationDtoTranslator } from './Translators/ReactionApplicationDtoTranslator'
import { UpdatePostReactionRequestDto } from './Dtos/UpdatePostReactionRequestDto'
import { UpdatePostReactionApplicationException } from './UpdatePostReactionApplicationException'
import { UserRepositoryInterface } from '~/modules/Auth/Domain/UserRepositoryInterface'
import { PostRepositoryInterface, RepositoryOptions } from '~/modules/Posts/Domain/PostRepositoryInterface'
import { PostDomainException } from '~/modules/Posts/Domain/PostDomainException'
import { Reaction } from '~/modules/Posts/Domain/PostReaction'

export class UpdatePostReaction {
  private options: RepositoryOptions[] = ['reactions', 'reactions.user']

  // eslint-disable-next-line no-useless-constructor
  constructor (
    private readonly postRepository: PostRepositoryInterface,
    private readonly userRepository: UserRepositoryInterface
  ) {}

  public async update (
    request: UpdatePostReactionRequestDto
  ): Promise<ReactionApplicationDto> {
    const post = await this.postRepository.findById(request.postId, this.options)

    if (post === null) {
      throw UpdatePostReactionApplicationException.postNotFound(request.postId)
    }

    const user = await this.userRepository.findById(request.userId)

    if (user === null) {
      throw UpdatePostReactionApplicationException.userNotFound(request.userId)
    }

    try {
      const reaction = post.updateReaction(request.userId, request.reactionType as Reaction)

      await this.postRepository.updateReaction(reaction)

      return ReactionApplicationDtoTranslator.fromDomain(reaction)
    } catch (exception: unknown) {
      if (!(exception instanceof PostDomainException)) {
        throw exception
      }

      switch (exception.id) {
        case PostDomainException.userHasNotReactedId:
          throw UpdatePostReactionApplicationException.userHasNotReacted(request.userId, request.postId)

        default:
          throw UpdatePostReactionApplicationException.cannotUpdateReaction(request.userId, request.postId)
      }
    }
  }
}
