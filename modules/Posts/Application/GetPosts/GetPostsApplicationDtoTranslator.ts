import { PostWithCountInterface } from '~/modules/Posts/Domain/PostWithCountInterface'
import { GetPostsApplicationResponse } from '~/modules/Posts/Application/GetPosts/GetPostsApplicationDto'
import { PostApplicationDtoTranslator } from '~/modules/Posts/Application/Translators/PostApplicationDtoTranslator'

export class GetPostsApplicationDtoTranslator {
  public static fromDomain (
    postsWithCount: PostWithCountInterface[],
    postsNumber: number
  ): GetPostsApplicationResponse {
    const posts = postsWithCount.map((postWithCount) => {
      return {
        post: PostApplicationDtoTranslator.fromDomain(postWithCount.post),
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
