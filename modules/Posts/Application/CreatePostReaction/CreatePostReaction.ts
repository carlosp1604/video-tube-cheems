import { CreatePostReactionApplicationRequest } from './CreatePostReactionApplicationRequest'
import { CreatePostReactionApplicationException } from './CreatePostReactionApplicationException'
import { PostRepositoryInterface, RepositoryOptions } from '~/modules/Posts/Domain/PostRepositoryInterface'
import { UserRepositoryInterface } from '~/modules/Auth/Domain/UserRepositoryInterface'
import { PostDomainException } from '~/modules/Posts/Domain/PostDomainException'
import { User } from '~/modules/Auth/Domain/User'
import { Post } from '~/modules/Posts/Domain/Post'
import { PostReactionApplicationDto } from '~/modules/Posts/Application/Dtos/PostReactionApplicationDto'
import {
  PostReactionApplicationDtoTranslator
} from '~/modules/Posts/Application/Translators/PostReactionApplicationDtoTranslator'
import { PostReaction } from '~/modules/Posts/Domain/PostReaction'

export class CreatePostReaction {
  private options: RepositoryOptions[] = ['reactions', 'reactions.user']

  // eslint-disable-next-line no-useless-constructor
  constructor (
    private readonly postRepository: PostRepositoryInterface,
    private readonly userRepository: UserRepositoryInterface
  ) {}

  public async create (
    request: CreatePostReactionApplicationRequest
  ): Promise<PostReactionApplicationDto> {
    const [post, _user] = await Promise.all([
      this.getPost(request.postId),
      this.getUser(request.userId),
    ])

    const reaction = this.addReactionToPost(post, request)

    await this.postRepository.createReaction(reaction)

    return PostReactionApplicationDtoTranslator.fromDomain(reaction)
  }

  private async getPost (postId: CreatePostReactionApplicationRequest['postId']): Promise<Post> {
    const post = await this.postRepository.findById(postId, this.options)

    if (post === null) {
      throw CreatePostReactionApplicationException.postNotFound(postId)
    }

    return post
  }

  private async getUser (userId: CreatePostReactionApplicationRequest['userId']): Promise<User> {
    const user = await this.userRepository.findById(userId)

    if (user === null) {
      throw CreatePostReactionApplicationException.userNotFound(userId)
    }

    return user
  }

  private addReactionToPost (post: Post, request: CreatePostReactionApplicationRequest): PostReaction {
    try {
      return post.addReaction(request.userId, request.reactionType)
    } catch (exception: unknown) {
      if (!(exception instanceof PostDomainException)) {
        throw exception
      }

      switch (exception.id) {
        case PostDomainException.userAlreadyReactedId:
          throw CreatePostReactionApplicationException.userAlreadyReacted(request.userId, request.postId)

        case PostDomainException.cannotAddReactionId:
          throw CreatePostReactionApplicationException.cannotAddReaction(request.userId, request.postId)

        default:
          throw exception
      }
    }
  }
}
