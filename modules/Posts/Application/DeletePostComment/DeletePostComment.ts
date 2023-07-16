import { DeletePostCommentApplicationRequestDto } from './DeletePostCommentApplicationRequestDto'
import { DeletePostCommentApplicationException } from './DeletePostCommentApplicationException'
import { PostRepositoryInterface, RepositoryOptions } from '~/modules/Posts/Domain/PostRepositoryInterface'
import { UserRepositoryInterface } from '~/modules/Auth/Domain/UserRepositoryInterface'
import { PostDomainException } from '~/modules/Posts/Domain/PostDomainException'
import { Post } from '~/modules/Posts/Domain/Post'
import {
  CreatePostCommentApplicationException
} from '~/modules/Posts/Application/CreatePostComment/CreatePostCommentApplicationException'
import { User } from '~/modules/Auth/Domain/User'

export class DeletePostComment {
  private options: RepositoryOptions[] =
    ['comments', 'comments.user', 'comments.childComments', 'comments.childComments.user']

  // eslint-disable-next-line no-useless-constructor
  constructor (
    private readonly postRepository: PostRepositoryInterface,
    private readonly userRepository: UserRepositoryInterface
  ) {}

  public async delete (request: DeletePostCommentApplicationRequestDto): Promise<void> {
    const post = await this.getPost(request.postId)

    const user = await this.getUser(request.userId)

    if (request.parentCommentId !== null) {
      this.deletePostComment(post, user, request)
    } else {
      this.deletePostChildComment(post, user, request)
    }

    await this.deletePostCommentFromPersistence(request)
  }

  private async getPost (postId: DeletePostCommentApplicationRequestDto['postId']): Promise<Post> {
    const post = await this.postRepository.findById(postId, this.options)

    if (post === null) {
      throw CreatePostCommentApplicationException.postNotFound(postId)
    }

    return post
  }

  private async getUser (userId: DeletePostCommentApplicationRequestDto['userId']): Promise<User> {
    const user = await this.userRepository.findById(userId)

    if (user === null) {
      throw CreatePostCommentApplicationException.userNotFound(userId)
    }

    return user
  }

  private deletePostComment (post: Post, user: User, request: DeletePostCommentApplicationRequestDto): void {
    try {
      post.deleteComment(request.postCommentId, user.id)
    } catch (exception: unknown) {
      if (!(exception instanceof PostDomainException)) {
        throw exception
      }

      if (exception.id === PostDomainException.postCommentNotFoundId) {
        throw DeletePostCommentApplicationException.postCommentNotFound(request.postCommentId)
      }

      if (exception.id === PostDomainException.userCannotDeleteCommentId) {
        throw DeletePostCommentApplicationException.userCannotDeleteComment(request.userId, request.postCommentId)
      }

      if (exception.id === PostDomainException.cannotDeleteCommentId) {
        throw DeletePostCommentApplicationException.cannotDeleteComment(request.postCommentId)
      }

      throw exception
    }
  }

  private deletePostChildComment (post: Post, user: User, request: DeletePostCommentApplicationRequestDto): void {
    try {
      post.deleteChildComment(request.parentCommentId as string, request.postCommentId, user.id)
    } catch (exception: unknown) {
      if (!(exception instanceof PostDomainException)) {
        throw exception
      }

      if (exception.id === PostDomainException.parentCommentNotFoundId) {
        throw DeletePostCommentApplicationException.parentCommentNotFound(request.parentCommentId as string)
      }

      if (exception.id === PostDomainException.postCommentNotFoundId) {
        throw DeletePostCommentApplicationException.postCommentNotFound(request.postCommentId)
      }

      if (exception.id === PostDomainException.userCannotDeleteCommentId) {
        throw DeletePostCommentApplicationException.userCannotDeleteComment(request.userId, request.postCommentId)
      }

      if (exception.id === PostDomainException.cannotDeleteCommentId) {
        throw DeletePostCommentApplicationException.cannotDeleteComment(request.postCommentId)
      }

      throw exception
    }
  }

  private async deletePostCommentFromPersistence (request: DeletePostCommentApplicationRequestDto): Promise<void> {
    try {
      await this.postRepository.deleteComment(request.postCommentId)
    } catch (exception: unknown) {
      console.error(exception)

      throw DeletePostCommentApplicationException.cannotDeleteCommentFromPersistence(request.postCommentId)
    }
  }
}
