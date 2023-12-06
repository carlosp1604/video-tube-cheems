import { PostWithViewsInterface } from '~/modules/Posts/Domain/PostWithCountInterface'
import { GetPostsApplicationResponse } from '~/modules/Posts/Application/Dtos/GetPostsApplicationDto'
import {
  PostWithRelationsAndViewsApplicationDtoTranslator
} from '~/modules/Posts/Application/Translators/PostWithRelationsAndViewsDtoTranslator'

export class GetPostsApplicationDtoTranslator {
  public static fromDomain (
    postsWithViews: PostWithViewsInterface[],
    postsNumber: number
  ): GetPostsApplicationResponse {
    return {
      posts: postsWithViews.map((postWithViews) => {
        return PostWithRelationsAndViewsApplicationDtoTranslator.fromDomain(postWithViews.post, postWithViews.postViews)
      }),
      postsNumber,
    }
  }
}
