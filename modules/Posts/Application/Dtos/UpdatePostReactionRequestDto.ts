export interface UpdatePostReactionRequestDto {
  readonly reactionType: string
  readonly postId: string
  readonly userId: string
}