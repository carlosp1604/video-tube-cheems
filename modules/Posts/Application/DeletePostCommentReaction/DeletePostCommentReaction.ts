import { DeletePostCommentReactionApplicationRequestDto } from './DeletePostCommentReactionApplicationRequestDto'
import { DeletePostCommentReactionApplicationException } from './DeletePostCommentReactionApplicationException'
import { UserRepositoryInterface } from '~/modules/Auth/Domain/UserRepositoryInterface'
import { User } from '~/modules/Auth/Domain/User'
import { ReactionableModelDomainException } from '~/modules/Reactions/Domain/ReactionableModelDomainException'
import { PostCommentRepositoryInterface } from '~/modules/Posts/Domain/PostComments/PostCommentRepositoryInterface'
import { ReactionRepositoryInterface } from '~/modules/Reactions/Domain/ReactionRepositoryInterface'
import { PostChildComment } from '~/modules/Posts/Domain/PostComments/PostChildComment'
import { PostComment } from '~/modules/Posts/Domain/PostComments/PostComment'

export class DeletePostCommentReaction {
  // eslint-disable-next-line no-useless-constructor
  constructor (
    private readonly postCommentRepository: PostCommentRepositoryInterface,
    private readonly userRepository: UserRepositoryInterface,
    private readonly reactionRepository: ReactionRepositoryInterface
  ) {}

  public async delete (request: DeletePostCommentReactionApplicationRequestDto): Promise<void> {
    const [postComment, user] = await Promise.all([
      this.getPostComment(request.postCommentId, request.parentCommentId),
      this.getUser(request.userId),
    ])

    this.deleteReactionFromPostComment(postComment, user)

    await this.reactionRepository.remove(request.postCommentId, request.userId)
  }

  private async getPostComment (
    postCommentId: DeletePostCommentReactionApplicationRequestDto['postCommentId'],
    parentCommentId: DeletePostCommentReactionApplicationRequestDto['parentCommentId']
  ): Promise<PostComment | PostChildComment> {
    const postComment = await this.postCommentRepository.findById(postCommentId, parentCommentId)

    if (postComment === null) {
      throw DeletePostCommentReactionApplicationException.postCommentNotFound(postCommentId)
    }

    return postComment
  }

  private async getUser (userId: DeletePostCommentReactionApplicationRequestDto['userId']): Promise<User> {
    const user = await this.userRepository.findById(userId)

    if (user === null) {
      throw DeletePostCommentReactionApplicationException.userNotFound(userId)
    }

    return user
  }

  private deleteReactionFromPostComment (
    postComment: PostComment | PostChildComment,
    user: User
  ): void {
    try {
      postComment.deleteReaction(user.id)
    } catch (exception: unknown) {
      if (!(exception instanceof ReactionableModelDomainException)) {
        throw exception
      }

      switch (exception.id) {
        case ReactionableModelDomainException.userHasNotReactedId:
          throw DeletePostCommentReactionApplicationException.userHasNotReacted(user.id, postComment.id)

        default:
          throw exception
      }
    }
  }
}
