import { CreatePostCommentApplicationRequestDto } from './CreatePostCommentApplicationRequestDto'
import { CreatePostCommentApplicationException } from './CreatePostCommentApplicationException'
import { PostRepositoryInterface, RepositoryOptions } from '~/modules/Posts/Domain/PostRepositoryInterface'
import { UserRepositoryInterface } from '~/modules/Auth/Domain/UserRepositoryInterface'
import { Post } from '~/modules/Posts/Domain/Post'
import { PostComment } from '~/modules/Posts/Domain/PostComments/PostComment'
import {
  PostCommentApplicationDtoTranslator
} from '~/modules/Posts/Application/Translators/PostCommentApplicationDtoTranslator'
import { PostCommentApplicationDto } from '~/modules/Posts/Application/Dtos/PostCommentApplicationDto'
import { User } from '~/modules/Auth/Domain/User'

export class CreatePostComment {
  private options: RepositoryOptions[] = ['comments', 'comments.user']

  // eslint-disable-next-line no-useless-constructor
  constructor (
    private readonly postRepository: PostRepositoryInterface,
    private readonly userRepository: UserRepositoryInterface
  ) {}

  public async create (request: CreatePostCommentApplicationRequestDto): Promise<PostCommentApplicationDto> {
    const post = await this.getPost(request.postId)

    const user = await this.getUser(request.userId)

    const postComment = this.addCommentToPost(post, user, request)

    await this.savePostComment(postComment)

    return PostCommentApplicationDtoTranslator.fromDomain(postComment)
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

  private addCommentToPost (post: Post, user: User, request: CreatePostCommentApplicationRequestDto): PostComment {
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
