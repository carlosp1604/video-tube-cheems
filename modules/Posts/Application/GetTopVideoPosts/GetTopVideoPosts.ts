import { PostRepositoryInterface, TopPostOptions } from '~/modules/Posts/Domain/PostRepositoryInterface'
import {
  GetTopVideoPostsApplicationRequestDto
} from '~/modules/Posts/Application/GetTopVideoPosts/GetTopVideoPostsApplicationRequestDto'
import {
  PostWithRelationsAndViewsApplicationDto
} from '~/modules/Posts/Application/Dtos/PostWithRelationsAndViewsApplicationDto'
import {
  PostWithRelationsAndViewsApplicationDtoTranslator
} from '~/modules/Posts/Application/Translators/PostWithRelationsAndViewsDtoTranslator'

export class GetTopVideoPosts {
  // eslint-disable-next-line no-useless-constructor
  constructor (private readonly postRepository: PostRepositoryInterface) {}

  public async get (
    requestDto: GetTopVideoPostsApplicationRequestDto
  ): Promise<PostWithRelationsAndViewsApplicationDto[]> {
    const posts =
      await this.postRepository.getTopPosts(requestDto.date as TopPostOptions, requestDto.postsNumber)

    return posts.map((post) =>
      PostWithRelationsAndViewsApplicationDtoTranslator.fromDomain(post.post, post.postViews))
  }
}
