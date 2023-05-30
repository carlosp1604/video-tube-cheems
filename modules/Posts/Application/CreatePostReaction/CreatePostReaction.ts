import { AddPostReactionApplicationRequest } from './AddPostReactionApplicationRequest'
import { CreatePostReactionApplicationException } from './CreatePostReactionApplicationException'
import { PostRepositoryInterface, RepositoryOptions } from '~/modules/Posts/Domain/PostRepositoryInterface'
import { UserRepositoryInterface } from '~/modules/Auth/Domain/UserRepositoryInterface'
import { ReactionApplicationDto } from '~/modules/Posts/Application/Dtos/ReactionApplicationDto'
import {
  ReactionApplicationDtoTranslator
} from '~/modules/Posts/Application/Translators/ReactionApplicationDtoTranslator'
import { PostDomainException } from '~/modules/Posts/Domain/PostDomainException'
import { Post } from '~/modules/Posts/Domain/Post'
import { User } from '~/modules/Auth/Domain/User'

export class CreatePostReaction {
  private options: RepositoryOptions[] = ['reactions', 'reactions.user']

  // eslint-disable-next-line no-useless-constructor
  constructor (
    private readonly postRepository: PostRepositoryInterface,
    private readonly userRepository: UserRepositoryInterface
  ) {}

  public async create (
    request: AddPostReactionApplicationRequest
  ): Promise<ReactionApplicationDto> {
    const [post, _user] = await Promise.all([
      this.getPost(request.postId),
      this.getUser(request.userId),
    ])

    try {
      const reaction = post.addReaction(request.userId, request.reactionType)

      await this.postRepository.createReaction(reaction)

      return ReactionApplicationDtoTranslator.fromDomain(reaction)
    } catch (exception: unknown) {
      if (!(exception instanceof PostDomainException)) {
        throw exception
      }

      switch (exception.id) {
        case PostDomainException.userAlreadyReactedId:
          throw CreatePostReactionApplicationException.userAlreadyReacted(request.userId, request.postId)

        case PostDomainException.userHasNotReactedId:
          throw CreatePostReactionApplicationException.userHasNotReacted(request.userId, request.postId)

        default:
          throw CreatePostReactionApplicationException.cannotAddReaction(request.userId, request.postId)
      }
    }
  }

  private async getPost (postId: AddPostReactionApplicationRequest['postId']): Promise<Post> {
    const post = await this.postRepository.findById(postId, this.options)

    if (post === null) {
      throw CreatePostReactionApplicationException.postNotFound(postId)
    }

    return post
  }

  private async getUser (userId: AddPostReactionApplicationRequest['userId']): Promise<User> {
    const user = await this.userRepository.findById(userId)

    if (user === null) {
      throw CreatePostReactionApplicationException.userNotFound(userId)
    }

    return user
  }
}
