import { Reaction } from '~/modules/Reactions/Domain/Reaction'

export interface PostUserInteraction {
  reaction: Reaction | null
  savedPost: boolean
}
