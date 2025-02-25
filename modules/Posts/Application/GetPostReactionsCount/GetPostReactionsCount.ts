import { PostRepositoryInterface } from '~/modules/Posts/Domain/PostRepositoryInterface'
import {
  GetPostReactionsCountApplicationRequestDto
} from '~/modules/Posts/Application/GetPostReactionsCount/GetPostReactionsCountApplicationRequestDto'
import {
  GetPostReactionsCountApplicationResponseDto
} from '~/modules/Posts/Application/GetPostReactionsCount/GetPostReactionsCountApplicationResponseDto'

export class GetPostReactionsCount {
  // eslint-disable-next-line no-useless-constructor
  constructor (private readonly postRepository: PostRepositoryInterface) {}

  public async get (
    request: GetPostReactionsCountApplicationRequestDto
  ): Promise<GetPostReactionsCountApplicationResponseDto> {
    const postReactionsCount = await this.postRepository.findPostReactionsCount(request.postId)

    return {
      likes: postReactionsCount.likes,
      dislikes: postReactionsCount.dislikes,
    }
  }
}
