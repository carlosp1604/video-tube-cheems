import { PostChildCommentApplicationDto } from './PostChildCommentApplicationDto'

export interface GetPostPostChildCommentsResponseDto {
  readonly childComments: PostChildCommentApplicationDto[]
  readonly childCommentsCount: number
}
