export enum ReactionType {
  LIKE = 'like',
  DISLIKE = 'dislike'
}

export interface PostReactionComponentDto {
  postId: string
  userId: string
  reactionType: string
}
