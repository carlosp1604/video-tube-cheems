import { PostRepositoryInterface, RepositoryOptions } from '../Domain/PostRepositoryInterface'
import { GetPostByIdApplicationException } from './GetPostByIdApplicationException'
import { CreatePostCommentRequestDto } from './Dtos/CreatePostCommentRequestDto'
import { UserRepositoryInterface } from '../../Auth/Domain/UserRepositoryInterface'
import { PostDomainException } from '../Domain/PostDomainException'
import { CreatePostCommentApplicationException } from './CreatePostCommentApplicationException'
import { CommentApplicationDto } from './Dtos/CommentApplicationDto'
import { CommentApplicationDtoTranslator } from './Translators/CommentApplicationDtoTranslator'

export class CreatePostComment {
  private options: RepositoryOptions[] = ['comments', 'comments.user']

  constructor(
    private readonly postRepository: PostRepositoryInterface,
    private readonly userRepository: UserRepositoryInterface
  ) {}

  public async create(request: CreatePostCommentRequestDto): Promise<CommentApplicationDto> {
    const post = await this.postRepository.findById(request.postId, this.options)

    if (post === null) {
      throw GetPostByIdApplicationException.postNotFound(request.postId)
    }

    const user = await this.userRepository.findById(request.userId)
    
    if (user === null) {
      throw GetPostByIdApplicationException.userNotFound(request.userId)
    }

    try {
      const comment = post.addComment(request.comment, request.userId, request.parentCommentId)

      comment.setUser(user)

      await this.postRepository.createComment(comment)
      
      return CommentApplicationDtoTranslator.fromDomain(comment)
    }
    catch (exception: unknown) {
      if (!(exception instanceof PostDomainException)) {
        throw exception
      }

      throw CreatePostCommentApplicationException.cannotAddComment(request.postId, request.userId)
    }
  }
}