import { PostComment } from './PostComment'
import { Reaction } from '~/modules/Reactions/Domain/Reaction'

export interface PostCommentWithCountAndUserInteraction {
  postComment: PostComment
  childComments: number
  reactions: number
  userReaction: Reaction | null
}
