import { PostRepositoryInterface, RepositoryOptions } from '../Domain/PostRepositoryInterface'
import { UserRepositoryInterface } from '../../Auth/Domain/UserRepositoryInterface'
import { PostDomainException } from '../Domain/PostDomainException'
import { DeletePostReactionRequestDto } from './Dtos/DeletePostReactionRequestDto'
import { DeletePostReactionApplicationException } from './DeletePostReactionApplicationException'

export class UpdatePostReaction {
  private options: RepositoryOptions[] = ['reactions', 'reactions.user']

  constructor(
    private readonly postRepository: PostRepositoryInterface,
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  public async delete(
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
    }
    catch (exception: unknown) {
      if (!(exception instanceof PostDomainException)) {
        throw exception
      }

      throw DeletePostReactionApplicationException.cannotDeleteReaction(request.userId, request.postId)
    }
  }
}