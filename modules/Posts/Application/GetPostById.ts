import { PostRepositoryInterface, RepositoryOptions } from '../Domain/PostRepositoryInterface'
import { PostApplicationDto } from './Dtos/PostApplicationDto'
import { Post } from '../Domain/Post'
import { PostApplicationDtoTranslator } from './Translators/PostApplicationDtoTranslator'
import { GetPostByIdApplicationException } from './GetPostByIdApplicationException'

export class GetPostById {
  private options: RepositoryOptions[] =
    ['comments', 'comments.user', 'reactions', 'actors', 'meta', 'tags',
      'comments.childComments', 'comments.childComments.user']

  constructor(
    private readonly postRepository: PostRepositoryInterface
  ) {}

  public async get(postId: Post['id']): Promise<PostApplicationDto> {
    const post = await this.postRepository.findById(postId, this.options)

    if (post === null) {
      throw GetPostByIdApplicationException.postNotFound(postId)
    }

    return PostApplicationDtoTranslator.fromDomain(post)
  }
}