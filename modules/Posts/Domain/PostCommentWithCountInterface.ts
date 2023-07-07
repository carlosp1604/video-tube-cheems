import { PostComment } from './PostComment'

export interface PostCommentWithCount {
  postComment: PostComment
  childComments: number
}
