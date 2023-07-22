import { DeletePostReactionApplicationRequestDto } from './DeletePostReactionApplicationRequestDto'
import { DeletePostReactionApplicationException } from './DeletePostReactionApplicationException'
import { PostRepositoryInterface, RepositoryOptions } from '~/modules/Posts/Domain/PostRepositoryInterface'
import { UserRepositoryInterface } from '~/modules/Auth/Domain/UserRepositoryInterface'
import { PostDomainException } from '~/modules/Posts/Domain/PostDomainException'
import { Post } from '~/modules/Posts/Domain/Post'
import { User } from '~/modules/Auth/Domain/User'

export class DeletePostReaction {
  private options: RepositoryOptions[] = ['reactions']

  // eslint-disable-next-line no-useless-constructor
  constructor (
    private readonly postRepository: PostRepositoryInterface,
    private readonly userRepository: UserRepositoryInterface
  ) {}

  public async delete (request: DeletePostReactionApplicationRequestDto): Promise<void> {
    const [post, user] = await Promise.all([
      this.getPost(request.postId),
      this.getUser(request.userId),
    ])

    this.deleteReactionFromPost(post, user)

    await this.postRepository.deleteReaction(request.userId, request.postId)
  }

  private async getPost (postId: DeletePostReactionApplicationRequestDto['postId']): Promise<Post> {
    const post = await this.postRepository.findById(postId, this.options)

    if (post === null) {
      throw DeletePostReactionApplicationException.postNotFound(postId)
    }

    return post
  }

  private async getUser (userId: DeletePostReactionApplicationRequestDto['userId']): Promise<User> {
    const user = await this.userRepository.findById(userId)

    if (user === null) {
      throw DeletePostReactionApplicationException.userNotFound(userId)
    }

    return user
  }

  private deleteReactionFromPost (post: Post, user: User): void {
    try {
      post.deleteReaction(user.id)
    } catch (exception: unknown) {
      if (!(exception instanceof PostDomainException)) {
        throw exception
      }

      switch (exception.id) {
        case PostDomainException.userHasNotReactedId:
          throw DeletePostReactionApplicationException.userHasNotReacted(user.id, post.id)

        default:
          throw exception
      }
    }
  }
}
