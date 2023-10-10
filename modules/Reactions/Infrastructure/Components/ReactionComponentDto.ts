export enum ReactionType {
  LIKE = 'like',
  DISLIKE = 'dislike'
}

export interface ReactionComponentDto {
  reactionableId: string
  userId: string
  reactionType: string
}
