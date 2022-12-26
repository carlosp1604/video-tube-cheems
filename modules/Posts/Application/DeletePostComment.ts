import { PostRepositoryInterface, RepositoryOptions } from '../Domain/PostRepositoryInterface'
import { UserRepositoryInterface } from '../../Auth/Domain/UserRepositoryInterface'
import { PostDomainException } from '../Domain/PostDomainException'
import { DeletePostCommentRequestDto } from './Dtos/DeletePostCommentRequestDto'
import { DeletePostCommentApplicationException } from './DeletePostCommentApplicationException'

export class DeletePostComment {
  private options: RepositoryOptions[] = ['comments', 'comments.user']

  constructor(
    private readonly postRepository: PostRepositoryInterface,
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  public async delete(request: DeletePostCommentRequestDto): Promise<void> {
    const post = await this.postRepository.findById(request.postId, this.options)

    if (post === null) {
      throw DeletePostCommentApplicationException.postNotFound(request.postId)
    }

    const user = await this.userRepository.findById(request.userId)

    if (user === null) {
      throw DeletePostCommentApplicationException.userNotFound(request.userId)
    }
    
    try {
      post.deleteComment(request.postCommentId, request.postParentId)

      await this.postRepository.deleteComment(request.postCommentId)
    }
    catch (exception: unknown) {
      console.log(exception)
      if (!(exception instanceof PostDomainException)) {
        throw exception
      }

      throw DeletePostCommentApplicationException
        .cannotDeleteComment(request.postCommentId, request.postId)
    }
  }
}