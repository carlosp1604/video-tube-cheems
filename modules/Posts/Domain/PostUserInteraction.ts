import { Reaction } from '~/modules/Reactions/Domain/Reaction'

export interface PostReactionsInterface {
  likes: number
  dislikes: number
}

export interface PostUserInteraction {
  reaction: Reaction | null
  savedPost: boolean
}
