import { UserRepositoryInterface } from '~/modules/Auth/Domain/UserRepositoryInterface'
import { User } from '~/modules/Auth/Domain/User'
import { ModelReactionApplicationDto } from '~/modules/Reactions/Application/ModelReactionApplicationDto'
import {
  PostReactionApplicationDtoTranslator
} from '~/modules/Posts/Application/Translators/PostReactionApplicationDtoTranslator'
import { Reaction, ReactionType } from '~/modules/Reactions/Domain/Reaction'
import { ReactionableModelDomainException } from '~/modules/Reactions/Domain/ReactionableModelDomainException'
import { ReactionRepositoryInterface } from '~/modules/Reactions/Domain/ReactionRepositoryInterface'
import { PostCommentRepositoryInterface } from '~/modules/Posts/Domain/PostComments/PostCommentRepositoryInterface'
import {
  CreatePostCommentReactionApplicationRequest
} from '~/modules/Posts/Application/CreatePostCommentReaction/CreatePostCommentReactionApplicationRequest'
import { PostComment } from '~/modules/Posts/Domain/PostComments/PostComment'
import { PostChildComment } from '~/modules/Posts/Domain/PostComments/PostChildComment'
import {
  CreatePostCommentReactionApplicationException
} from '~/modules/Posts/Application/CreatePostCommentReaction/CreatePostCommentReactionApplicationException'

export class CreatePostCommentReaction {
  // eslint-disable-next-line no-useless-constructor
  constructor (
    private readonly postCommentRepository: PostCommentRepositoryInterface,
    private readonly userRepository: UserRepositoryInterface,
    private readonly reactionRepository: ReactionRepositoryInterface
  ) {}

  public async create (
    request: CreatePostCommentReactionApplicationRequest
  ): Promise<ModelReactionApplicationDto> {
    const [postComment, _user] = await Promise.all([
      this.getPostComment(request.postCommentId, request.parentCommentId),
      this.getUser(request.userId),
    ])

    const reaction = this.addReactionToPostComment(postComment, request)

    await this.reactionRepository.save(reaction)

    return PostReactionApplicationDtoTranslator.fromDomain(reaction)
  }

  private async getPostComment (
    postCommentId: CreatePostCommentReactionApplicationRequest['postCommentId'],
    parentCommentId: CreatePostCommentReactionApplicationRequest['parentCommentId']
  ): Promise<PostComment | PostChildComment> {
    const postComment = await this.postCommentRepository.findById(postCommentId, parentCommentId)

    if (postComment === null) {
      throw CreatePostCommentReactionApplicationException.postCommentNotFound(postCommentId)
    }

    return postComment
  }

  private async getUser (userId: CreatePostCommentReactionApplicationRequest['userId']): Promise<User> {
    const user = await this.userRepository.findById(userId)

    if (user === null) {
      throw CreatePostCommentReactionApplicationException.userNotFound(userId)
    }

    return user
  }

  private addReactionToPostComment (
    postComment: PostComment | PostChildComment,
    request: CreatePostCommentReactionApplicationRequest
  ): Reaction {
    try {
      // FIXME: Reaction type should comes from request when we support multiple reaction types in the comments
      return postComment.addReaction(request.userId, ReactionType.LIKE)
    } catch (exception: unknown) {
      if (!(exception instanceof ReactionableModelDomainException)) {
        throw exception
      }

      switch (exception.id) {
        case ReactionableModelDomainException.userAlreadyReactedId:
          throw CreatePostCommentReactionApplicationException.userAlreadyReacted(request.userId, request.postCommentId)

        case ReactionableModelDomainException.cannotAddReactionId:
          throw CreatePostCommentReactionApplicationException.cannotAddReaction(request.userId, request.postCommentId)

        default:
          throw exception
      }
    }
  }
}
