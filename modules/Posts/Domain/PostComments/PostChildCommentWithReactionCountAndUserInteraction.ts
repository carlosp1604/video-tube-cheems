import { PostChildComment } from '~/modules/Posts/Domain/PostComments/PostChildComment'
import { Reaction } from '~/modules/Reactions/Domain/Reaction'

export interface PostChildCommentWithReactionCountAndUserInteraction {
  postChildComment: PostChildComment
  reactions: number
  userReaction: Reaction | null
}
