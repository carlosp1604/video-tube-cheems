import { PostWithCountInterface } from '~/modules/Posts/Domain/PostWithCountInterface'
import {
  GetRelatedPostsApplicationDto
} from '~/modules/Posts/Application/GetRelatedPosts/GetRelatedPostsApplicationDto'
import {
  PostWithProducerAndMetaApplicationDtoTranslator
} from '~/modules/Posts/Application/Translators/PostWithProducerAndMetaApplicationDtoTranslator'

export class GetRelatedPostsApplicationDtoTranslator {
  public static fromDomain (postsWithCount: PostWithCountInterface[]): GetRelatedPostsApplicationDto {
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
