import { PostRepositoryInterface, RepositoryOptions } from '~/modules/Posts/Domain/PostRepositoryInterface'
import { UpdatePostCommentRequestDto } from './Dtos/UpdatePostCommentRequestDto'
import { UpdatePostCommentApplicationException } from './UpdatePostCommentApplicationException'
import { PostCommentApplicationDtoTranslator } from './Translators/PostCommentApplicationDtoTranslator'
import { PostCommentApplicationDto } from './Dtos/PostCommentApplicationDto'
import { UserRepositoryInterface } from '~/modules/Auth/Domain/UserRepositoryInterface'
import { PostDomainException } from '~/modules/Posts/Domain/PostDomainException'

export class UpdatePostComment {
  private options: RepositoryOptions[] = ['comments', 'comments.user']

  // eslint-disable-next-line no-useless-constructor
  constructor (
    private readonly postRepository: PostRepositoryInterface,
    private readonly userRepository: UserRepositoryInterface
  ) {}

  public async update (
    request: UpdatePostCommentRequestDto
  ): Promise<PostCommentApplicationDto> {
    const post = await this.postRepository.findById(request.postId, this.options)

    if (post === null) {
      throw UpdatePostCommentApplicationException.postNotFound(request.postId)
    }

    const user = await this.userRepository.findById(request.userId)

    if (user === null) {
      throw UpdatePostCommentApplicationException.userNotFound(request.userId)
    }

    try {
      const updatedComment = post.updateComment(request.postCommentId, request.comment)

      await this.postRepository.updateComment(request.postCommentId, request.comment)

      return PostCommentApplicationDtoTranslator.fromDomain(updatedComment)
    } catch (exception: unknown) {
      if (!(exception instanceof PostDomainException)) {
        throw exception
      }

      throw UpdatePostCommentApplicationException
        .cannotUpdateComment(request.postCommentId, request.postId)
    }
  }
}
