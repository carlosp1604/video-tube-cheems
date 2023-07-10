import { CreatePostCommentApplicationException } from '../CreatePostComment/CreatePostCommentApplicationException'
import { CreatePostChildCommentRequestDto } from '../Dtos/CreatePostChildCommentRequestDto'
import { PostChildCommentApplicationDtoTranslator } from '../Translators/PostChildCommentApplicationDtoTranslator'
import { PostChildCommentApplicationDto } from '../Dtos/PostChildCommentApplicationDto'
import { PostRepositoryInterface, RepositoryOptions } from '~/modules/Posts/Domain/PostRepositoryInterface'
import { UserRepositoryInterface } from '~/modules/Auth/Domain/UserRepositoryInterface'
import { PostDomainException } from '~/modules/Posts/Domain/PostDomainException'
import {
  CreatePostCommentApplicationRequestDto
} from '~/modules/Posts/Application/CreatePostComment/CreatePostCommentApplicationRequestDto'
import { Post } from '~/modules/Posts/Domain/Post'
import { User } from '~/modules/Auth/Domain/User'
import { PostComment } from '~/modules/Posts/Domain/PostComment'

export class CreatePostChildComment {
  private options: RepositoryOptions[] =
    ['comments', 'comments.user', 'comments.childComments', 'comments.childComments.user']

  // eslint-disable-next-line no-useless-constructor
  constructor (
    private readonly postRepository: PostRepositoryInterface,
    private readonly userRepository: UserRepositoryInterface
  ) {}

  public async create (request: CreatePostChildCommentRequestDto): Promise<PostChildCommentApplicationDto> {
    const post = await this.getPost(request.postId)

    const user = await this.getUser(request.userId)

    try {
      const comment = post.addChildComment(request.parentCommentId, request.comment, request.userId)

      comment.setUser(user)

      await this.postRepository.createChildComment(comment)

      return PostChildCommentApplicationDtoTranslator.fromDomain(comment)
    } catch (exception: unknown) {
      if (!(exception instanceof PostDomainException)) {
        throw exception
      }

      throw CreatePostCommentApplicationException.cannotAddComment(request.postId, request.userId)
    }
  }

  private async getPost (postId: CreatePostCommentApplicationRequestDto['postId']): Promise<Post> {
    const post = await this.postRepository.findById(postId, this.options)

    if (post === null) {
      throw CreatePostCommentApplicationException.postNotFound(postId)
    }

    return post
  }

  private async getUser (userId: CreatePostCommentApplicationRequestDto['userId']): Promise<User> {
    const user = await this.userRepository.findById(userId)

    if (user === null) {
      throw CreatePostCommentApplicationException.userNotFound(userId)
    }

    return user
  }

  private addChildComment (post: Post, user: User, request: CreatePostCommentApplicationRequestDto): PostComment {
    return post.addComment(request.comment, user)
  }

  private async savePostComment (postComment: PostComment): Promise<void> {
    try {
      await this.postRepository.createComment(postComment)
    } catch (exception: unknown) {
      throw CreatePostCommentApplicationException.cannotAddComment(postComment.postId, postComment.userId)
    }
  }
}
