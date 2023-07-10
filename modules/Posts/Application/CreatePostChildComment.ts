import { GetPostBySlugApplicationException } from '~/modules/Posts/Application/GetPostBySlug/GetPostBySlugApplicationException'
import { CreatePostCommentApplicationException } from './CreatePostComment/CreatePostCommentApplicationException'
import { CreatePostChildCommentRequestDto } from './Dtos/CreatePostChildCommentRequestDto'
import { PostChildCommentApplicationDtoTranslator } from './Translators/PostChildCommentApplicationDtoTranslator'
import { PostChildCommentApplicationDto } from './Dtos/PostChildCommentApplicationDto'
import { PostRepositoryInterface, RepositoryOptions } from '~/modules/Posts/Domain/PostRepositoryInterface'
import { UserRepositoryInterface } from '~/modules/Auth/Domain/UserRepositoryInterface'
import { PostDomainException } from '~/modules/Posts/Domain/PostDomainException'

export class CreatePostChildComment {
  private options: RepositoryOptions[] =
    ['comments', 'comments.user', 'comments.childComments', 'comments.childComments.user']

  // eslint-disable-next-line no-useless-constructor
  constructor (
    private readonly postRepository: PostRepositoryInterface,
    private readonly userRepository: UserRepositoryInterface
  ) {}

  public async create (request: CreatePostChildCommentRequestDto): Promise<PostChildCommentApplicationDto> {
    const post = await this.postRepository.findById(request.postId, this.options)

    if (post === null) {
      throw GetPostBySlugApplicationException.postNotFound(request.postId)
    }

    const user = await this.userRepository.findById(request.userId)

    // FIXME:
    if (user === null) {
      throw Error()
    }

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
}
