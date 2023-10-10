import { PostWithViewsInterface } from '~/modules/Posts/Domain/PostWithCountInterface'
import { GetPostsApplicationResponse } from '~/modules/Posts/Application/GetPosts/GetPostsApplicationDto'
import {
  PostWithProducerAndMetaApplicationDtoTranslator
} from '~/modules/Posts/Application/Translators/PostWithProducerAndMetaApplicationDtoTranslator'

export class GetPostsApplicationDtoTranslator {
  public static fromDomain (
    postsWithViews: PostWithViewsInterface[],
    postsNumber: number
  ): GetPostsApplicationResponse {
    const posts = postsWithViews.map((postWithViews) => {
      return {
        post: PostWithProducerAndMetaApplicationDtoTranslator.fromDomain(postWithViews.post),
        postViews: postWithViews.postViews,
      }
    })

    return {
      posts,
      postsNumber,
    }
  }
}
