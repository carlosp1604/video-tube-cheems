import { PostRepositoryInterface, RepositoryOptions } from '../Domain/PostRepositoryInterface'
import { GetPostByIdApplicationException } from './GetPostByIdApplicationException'
import { CreatePostCommentRequestDto } from './Dtos/CreatePostCommentRequestDto'
import { DateTime } from 'luxon'
import { DateServiceInterface } from '../../../helpers/Domain/DateServiceInterface'
import { PostComment } from '../Domain/PostComment'
import { UuidGenerator } from '../../../helpers/Domain/UuidGenerator'
import { UserRepositoryInterface } from '../../Auth/Domain/UserRepositoryInterface'
import { PostDomainException } from '../Domain/PostDomainException'
import { PostCommentDomainException } from '../Domain/PostCommentDomainException'
import { CreatePostCommentApplicationException } from './CreatePostCommentApplicationException'

export class CreatePostComment {
  private options: RepositoryOptions[] = ['comments', 'comments.user']

  constructor(
    private readonly postRepository: PostRepositoryInterface,
    private readonly userRepository: UserRepositoryInterface,
    private readonly dateService: DateServiceInterface,
    private readonly idGenerator: UuidGenerator
  ) {}

  public async create(request: CreatePostCommentRequestDto): Promise<void> {
    const post = await this.postRepository.findById(request.postId, this.options)

    if (post === null) {
      throw GetPostByIdApplicationException.postNotFound(request.postId)
    }

    const user = await this.userRepository.findById(request.userId)

    if (user === null) {
      throw GetPostByIdApplicationException.userNotFound(request.userId)
    }

    const nowDate = DateTime.fromJSDate(this.dateService.nowDate())
    const comment = new PostComment(
      this.idGenerator.get(),
      request.comment,
      request.postId,
      request.userId,
      request.parentCommentId,
      nowDate,
      nowDate,
      null
    )

    try {
      post.addComment(comment)

      await this.postRepository.createComment(comment)
    }
    catch (exception: unknown) {
      if (
        !(exception instanceof PostDomainException) ||
        !(exception instanceof PostCommentDomainException)
      ) {
        throw exception
      }

      throw CreatePostCommentApplicationException.cannotAddComment(request.postId, request.userId)
    }
  }
}