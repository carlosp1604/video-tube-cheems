import { PostWithCountInterface } from '~/modules/Posts/Domain/PostWithCountInterface'
import { GetRelatedPostsApplicationResponse } from '~/modules/Posts/Application/GetRelatedPosts/GetRelatedPostsApplicationResponse'
import {
  PostWithProducerAndMetaApplicationDtoTranslator
} from '~/modules/Posts/Application/Translators/PostWithProducerAndMetaApplicationDtoTranslator'

export class GetRelatedPostsApplicationResponseTranslator {
  public static fromDomain (postsWithCount: PostWithCountInterface[]): GetRelatedPostsApplicationResponse {
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
    }
  }
}
