import { PostRepositoryInterface, RepositoryOptions } from '~/modules/Posts/Domain/PostRepositoryInterface'
import { UserRepositoryInterface } from '~/modules/Auth/Domain/UserRepositoryInterface'
import { Post } from '~/modules/Posts/Domain/Post'
import { User } from '~/modules/Auth/Domain/User'
import {
  CreatePostChildCommentApplicationRequestDto
} from '~/modules/Posts/Application/CreatePostChildComment/CreatePostChildCommentApplicationRequestDto'
import { PostChildComment } from '~/modules/Posts/Domain/PostChildComment'
import {
  CreatePostChildCommentApplicationException
} from '~/modules/Posts/Application/CreatePostChildComment/CreatePostChildCommentApplicationException'
import {
  PostChildCommentApplicationDtoTranslator
} from '~/modules/Posts/Application/Translators/PostChildCommentApplicationDtoTranslator'
import { PostDomainException } from '~/modules/Posts/Domain/PostDomainException'
import { PostChildCommentApplicationDto } from '~/modules/Posts/Application/Dtos/PostChildCommentApplicationDto'

export class CreatePostChildComment {
  private options: RepositoryOptions[] =
    ['comments', 'comments.user', 'comments.childComments', 'comments.childComments.user']

  // eslint-disable-next-line no-useless-constructor
  constructor (
    private readonly postRepository: PostRepositoryInterface,
    private readonly userRepository: UserRepositoryInterface
  ) {}

  public async create (request: CreatePostChildCommentApplicationRequestDto): Promise<PostChildCommentApplicationDto> {
    const post = await this.getPost(request.postId)

    const user = await this.getUser(request.userId)

    const postChildComment = this.addChildComment(post, user, request)

    await this.savePostChildComment(postChildComment)

    return PostChildCommentApplicationDtoTranslator.fromDomain(postChildComment)
  }

  private async getPost (postId: CreatePostChildCommentApplicationRequestDto['postId']): Promise<Post> {
    const post = await this.postRepository.findById(postId, this.options)

    if (post === null) {
      throw CreatePostChildCommentApplicationException.postNotFound(postId)
    }

    return post
  }

  private async getUser (userId: CreatePostChildCommentApplicationRequestDto['userId']): Promise<User> {
    const user = await this.userRepository.findById(userId)

    if (user === null) {
      throw CreatePostChildCommentApplicationException.userNotFound(userId)
    }

    return user
  }

  private addChildComment (
    post: Post,
    user: User,
    request: CreatePostChildCommentApplicationRequestDto
  ): PostChildComment {
    try {
      return post.addChildComment(request.parentCommentId, request.comment, user)
    } catch (exception: unknown) {
      if (!(exception instanceof PostDomainException)) {
        throw exception
      }

      if (exception.id === PostDomainException.parentCommentNotFoundId) {
        throw CreatePostChildCommentApplicationException.parentCommentNotFound(request.parentCommentId)
      }

      throw exception
    }
  }

  private async savePostChildComment (postChildComment: PostChildComment): Promise<void> {
    try {
      await this.postRepository.createChildComment(postChildComment)
    } catch (exception: unknown) {
      throw CreatePostChildCommentApplicationException
        .cannotAddChildComment(postChildComment.parentCommentId, postChildComment.userId)
    }
  }
}
