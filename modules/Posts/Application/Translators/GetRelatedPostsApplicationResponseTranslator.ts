import { PostWithCountInterface } from '../../Domain/PostWithCountInterface'
import { GetRelatedPostsApplicationResponse } from '../Dtos/GetRelatedPostsApplicationResponse'
import { PostApplicationDtoTranslator } from './PostApplicationDtoTranslator'

export class GetRelatedPostsApplicationResponseTranslator {
  public static fromDomain(postsWithCount: PostWithCountInterface[]): GetRelatedPostsApplicationResponse {
    const posts = postsWithCount.map((postWithCount) => {
      return {
        post: PostApplicationDtoTranslator.fromDomain(postWithCount.post),
        postComments: postWithCount.postComments,
        postReactions: postWithCount.postReactions
      }
    })

    return {
      posts,
    }
  }
}