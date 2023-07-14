import { DeletePostReactionRequestDto } from './Dtos/DeletePostReactionRequestDto'
import { DeletePostReactionApplicationException } from './DeletePostReactionApplicationException'
import { PostRepositoryInterface, RepositoryOptions } from '~/modules/Posts/Domain/PostRepositoryInterface'
import { UserRepositoryInterface } from '~/modules/Auth/Domain/UserRepositoryInterface'
import { PostDomainException } from '~/modules/Posts/Domain/PostDomainException'

export class UpdatePostReaction {
  private options: RepositoryOptions[] = ['reactions', 'reactions.user']

  // eslint-disable-next-line no-useless-constructor
  constructor (
    private readonly postRepository: PostRepositoryInterface,
    private readonly userRepository: UserRepositoryInterface
  ) {}

  public async delete (
    request: DeletePostReactionRequestDto
  ): Promise<void> {
    const post = await this.postRepository.findById(request.postId, this.options)

    if (post === null) {
      throw DeletePostReactionApplicationException.postNotFound(request.postId)
    }

    const user = await this.userRepository.findById(request.userId)

    if (user === null) {
      throw DeletePostReactionApplicationException.userNotFound(request.userId)
    }

    try {
      post.deleteReaction(request.userId)

      await this.postRepository.deleteReaction(request.userId, request.postId)
    } catch (exception: unknown) {
      if (!(exception instanceof PostDomainException)) {
        throw exception
      }

      throw DeletePostReactionApplicationException.cannotDeleteReaction(request.userId, request.postId)
    }
  }
}
