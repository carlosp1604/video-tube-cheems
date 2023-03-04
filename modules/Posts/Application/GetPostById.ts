import { PostRepositoryInterface } from '../Domain/PostRepositoryInterface'
import { Post } from '../Domain/Post'
import { PostApplicationDtoTranslator } from './Translators/PostApplicationDtoTranslator'
import { GetPostByIdApplicationException } from './GetPostByIdApplicationException'
import { GetPostByIdApplicationResponseDto } from './Dtos/GetPostByIdApplicationResponseDto'

export class GetPostById {
  constructor(
    private readonly postRepository: PostRepositoryInterface
  ) {}

  public async get(postId: Post['id']): Promise<GetPostByIdApplicationResponseDto> {
    const postWithCount = await this.postRepository.findByIdWithCount(postId)

    if (postWithCount === null) {
      throw GetPostByIdApplicationException.postNotFound(postId)
    }

    return {
      post: PostApplicationDtoTranslator.fromDomain(postWithCount.post),
      reactions: postWithCount.postReactions,
      comments: postWithCount.postComments
    }
  }
}