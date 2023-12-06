import { CreatePostReactionApplicationRequest } from './CreatePostReactionApplicationRequest'
import { CreatePostReactionApplicationException } from './CreatePostReactionApplicationException'
import { PostRepositoryInterface, RepositoryOptions } from '~/modules/Posts/Domain/PostRepositoryInterface'
import { UserRepositoryInterface } from '~/modules/Auth/Domain/UserRepositoryInterface'
import { User } from '~/modules/Auth/Domain/User'
import { Post } from '~/modules/Posts/Domain/Post'
import { ModelReactionApplicationDto } from '~/modules/Reactions/Application/ModelReactionApplicationDto'
import {
  PostReactionApplicationDtoTranslator
} from '~/modules/Posts/Application/Translators/PostReactionApplicationDtoTranslator'
import { Reaction } from '~/modules/Reactions/Domain/Reaction'
import { ReactionableModelDomainException } from '~/modules/Reactions/Domain/ReactionableModelDomainException'
import { ReactionRepositoryInterface } from '~/modules/Reactions/Domain/ReactionRepositoryInterface'

export class CreatePostReaction {
  private options: RepositoryOptions[] = ['reactions', 'reactions.user']

  // eslint-disable-next-line no-useless-constructor
  constructor (
    private readonly postRepository: PostRepositoryInterface,
    private readonly userRepository: UserRepositoryInterface,
    private readonly reactionRepository: ReactionRepositoryInterface
  ) {}

  public async create (
    request: CreatePostReactionApplicationRequest
  ): Promise<ModelReactionApplicationDto> {
    const [post, _user] = await Promise.all([
      this.getPost(request.postId),
      this.getUser(request.userId),
    ])

    const reaction = this.addReactionToPost(post, request)

    await this.reactionRepository.save(reaction)

    return PostReactionApplicationDtoTranslator.fromDomain(reaction)
  }

  private async getPost (postId: CreatePostReactionApplicationRequest['postId']): Promise<Post> {
    const post = await this.postRepository.findById(postId, this.options)

    if (post === null) {
      throw CreatePostReactionApplicationException.postNotFound(postId)
    }

    return post as Post
  }

  private async getUser (userId: CreatePostReactionApplicationRequest['userId']): Promise<User> {
    const user = await this.userRepository.findById(userId)

    if (user === null) {
      throw CreatePostReactionApplicationException.userNotFound(userId)
    }

    return user
  }

  private addReactionToPost (post: Post, request: CreatePostReactionApplicationRequest): Reaction {
    try {
      return post.createPostReaction(request.userId, request.reactionType)
    } catch (exception: unknown) {
      if (!(exception instanceof ReactionableModelDomainException)) {
        throw exception
      }

      switch (exception.id) {
        case ReactionableModelDomainException.userAlreadyReactedId:
          throw CreatePostReactionApplicationException.userAlreadyReacted(request.userId, request.postId)

        case ReactionableModelDomainException.cannotAddReactionId:
          throw CreatePostReactionApplicationException.cannotAddReaction(request.userId, request.postId)

        default:
          throw exception
      }
    }
  }
}
