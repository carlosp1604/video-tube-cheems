import { DeletePostCommentApplicationRequestDto } from '../DeletePostComment/DeletePostCommentApplicationRequestDto'
import { DeletePostCommentApplicationException } from '../DeletePostComment/DeletePostCommentApplicationException'
import { PostRepositoryInterface, RepositoryOptions } from '~/modules/Posts/Domain/PostRepositoryInterface'
import { UserRepositoryInterface } from '~/modules/Auth/Domain/UserRepositoryInterface'
import { PostDomainException } from '~/modules/Posts/Domain/PostDomainException'
import { Post } from '~/modules/Posts/Domain/Post'
import {
  CreatePostCommentApplicationException
} from '~/modules/Posts/Application/CreatePostComment/CreatePostCommentApplicationException'
import { User } from '~/modules/Auth/Domain/User'

export class DeletePostComment {
  private options: RepositoryOptions[] = ['comments', 'comments.user']

  // eslint-disable-next-line no-useless-constructor
  constructor (
    private readonly postRepository: PostRepositoryInterface,
    private readonly userRepository: UserRepositoryInterface
  ) {}

  public async delete (request: DeletePostCommentApplicationRequestDto): Promise<void> {
    const post = await this.getPost(request.postId)

    const user = await this.getUser(request.userId)

    if (request.parentCommentId !== null) {
      this.
    }

    // handle delete comment

    try {
      post.deleteComment(request.postCommentId)

      await this.postRepository.deleteComment(request.postCommentId)
    } catch (exception: unknown) {
      console.log(exception)
      if (!(exception instanceof PostDomainException)) {
        throw exception
      }

      throw DeletePostCommentApplicationException
        .cannotDeleteComment(request.postCommentId, request.postId)
    }
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

  private deletePostComment(post: Post, user: User, request: DeletePostCommentApplicationRequestDto): void {
    try {
      post.deleteComment(request.postCommentId, user.id)
    } catch (exception: unknown) {
      if (!(exception instanceof PostDomainException)) {
        throw exception
      }

      if (exception.id === PostDomainException.postCommentNotFoundId) {
        throw Error('asdasd')
      }

      if (exception.id === PostDomainException.userCannotDeleteCommentId) {
        throw Error('asdasd')
      }

      if (exception.id === PostDomainException.cannotDeleteCommentId) {
        throw Error('asdasd')
      }

      throw exception
    }
  }
}
