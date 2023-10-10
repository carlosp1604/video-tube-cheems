import { PostWithViewsInterface } from '~/modules/Posts/Domain/PostWithCountInterface'
import {
  GetRelatedPostsApplicationDto
} from '~/modules/Posts/Application/GetRelatedPosts/GetRelatedPostsApplicationDto'
import {
  PostWithProducerAndMetaApplicationDtoTranslator
} from '~/modules/Posts/Application/Translators/PostWithProducerAndMetaApplicationDtoTranslator'

export class GetRelatedPostsApplicationDtoTranslator {
  public static fromDomain (postsWithViews: PostWithViewsInterface[]): GetRelatedPostsApplicationDto {
    const posts = postsWithViews.map((postWithViews) => {
      return {
        post: PostWithProducerAndMetaApplicationDtoTranslator.fromDomain(postWithViews.post),
        postViews: postWithViews.postViews,
      }
    })

    return {
      posts,
    }
  }
}
