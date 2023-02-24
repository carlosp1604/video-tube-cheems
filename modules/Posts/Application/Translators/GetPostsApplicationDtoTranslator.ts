import { PostWithCountInterface } from '../../Domain/PostWithCountInterface'
import { GetPostsApplicationResponse } from '../Dtos/GetPostsApplicationDto'
import { PostApplicationDtoTranslator } from './PostApplicationDtoTranslator'

export class GetPostsApplicationDtoTranslator {
  public static fromDomain(
    postsWithCount: PostWithCountInterface[],
    postsNumber: number
  ): GetPostsApplicationResponse {
    const posts = postsWithCount.map((postWithCount) => {
      return {
        post: PostApplicationDtoTranslator.fromDomain(postWithCount.post),
        postComments: postWithCount.postComments,
        postReactions: postWithCount.postReactions
      }
    })

    return {
      posts,
      postsNumber
    }
  }
}