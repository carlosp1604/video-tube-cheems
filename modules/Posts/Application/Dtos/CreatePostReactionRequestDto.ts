export interface CreatePostReactionRequestDto {
  readonly reactionType: string
  readonly postId: string
  readonly userId: string
}