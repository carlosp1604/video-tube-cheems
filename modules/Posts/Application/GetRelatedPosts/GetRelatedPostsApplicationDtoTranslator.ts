import { PostWithViewsInterface } from '~/modules/Posts/Domain/PostWithCountInterface'
import {
  GetRelatedPostsApplicationDto
} from '~/modules/Posts/Application/GetRelatedPosts/GetRelatedPostsApplicationDto'
import {
  PostWithRelationsAndViewsApplicationDtoTranslator
} from '~/modules/Posts/Application/Translators/PostWithRelationsAndViewsDtoTranslator'

export class GetRelatedPostsApplicationDtoTranslator {
  public static fromDomain (postsWithViews: PostWithViewsInterface[]): GetRelatedPostsApplicationDto {
    return {
      posts: postsWithViews.map((postWithViews) => {
        return PostWithRelationsAndViewsApplicationDtoTranslator.fromDomain(postWithViews.post, postWithViews.postViews)
      }),
    }
  }
}
