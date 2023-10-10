import { PostCommentApplicationDto } from './PostCommentApplicationDto'
import { ModelReactionApplicationDto } from '~/modules/Reactions/Application/ModelReactionApplicationDto'

export interface PostWithChildCommentCountDto {
  readonly postComment: PostCommentApplicationDto
  readonly childrenNumber: number
  readonly reactionsNumber: number
  readonly userReaction: ModelReactionApplicationDto | null
}

export interface GetPostPostCommentsResponseDto {
  readonly postCommentsWithChildrenCount: PostWithChildCommentCountDto[]
  readonly postPostCommentsCount: number
}
