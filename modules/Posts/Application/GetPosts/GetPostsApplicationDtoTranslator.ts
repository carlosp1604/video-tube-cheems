import { PostWithCountInterface } from '~/modules/Posts/Domain/PostWithCountInterface'
import { GetPostsApplicationResponse } from '~/modules/Posts/Application/GetPosts/GetPostsApplicationDto'
import {
  PostWithProducerAndMetaApplicationDtoTranslator
} from '~/modules/Posts/Application/Translators/PostWithProducerAndMetaApplicationDtoTranslator'

export class GetPostsApplicationDtoTranslator {
  public static fromDomain (
    postsWithCount: PostWithCountInterface[],
    postsNumber: number
  ): GetPostsApplicationResponse {
    const posts = postsWithCount.map((postWithCount) => {
      return {
        post: PostWithProducerAndMetaApplicationDtoTranslator.fromDomain(postWithCount.post),
        postComments: postWithCount.postComments,
        postReactions: postWithCount.postReactions,
        postViews: postWithCount.postViews,
      }
    })

    return {
      posts,
      postsNumber,
    }
  }
}
