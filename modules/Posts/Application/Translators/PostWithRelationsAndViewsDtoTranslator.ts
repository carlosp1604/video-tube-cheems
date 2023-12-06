import { Post } from '~/modules/Posts/Domain/Post'
import {
  PostWithRelationsAndViewsApplicationDto
} from '~/modules/Posts/Application/Dtos/PostWithRelationsAndViewsApplicationDto'
import { PostWithRelationsDtoTranslator } from '~/modules/Posts/Application/Translators/PostWithRelationsDtoTranslator'

export class PostWithRelationsAndViewsApplicationDtoTranslator {
  public static fromDomain (post: Post, postViews: number): PostWithRelationsAndViewsApplicationDto {
    return {
      post: PostWithRelationsDtoTranslator.fromDomain(post),
      postViews,
    }
  }
}
