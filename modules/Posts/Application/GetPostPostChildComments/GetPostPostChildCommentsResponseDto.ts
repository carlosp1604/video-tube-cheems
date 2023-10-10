import { PostChildCommentApplicationDto } from '~/modules/Posts/Application/Dtos/PostChildCommentApplicationDto'
import { ModelReactionApplicationDto } from '~/modules/Reactions/Application/ModelReactionApplicationDto'

export interface PostChildCommentWithReactionsApplicationDto {
  readonly postChildComment: PostChildCommentApplicationDto
  readonly reactionsNumber: number
  readonly userReaction: ModelReactionApplicationDto | null
}

export interface GetPostPostChildCommentsResponseDto {
  readonly childCommentsWithReactions: PostChildCommentWithReactionsApplicationDto[]
  readonly childCommentsCount: number
}
