import { ChildCommentApplicationDto } from './ChildCommentApplicationDto'

export interface GetPostPostChildCommentsRespondeDto {
  readonly childComments: ChildCommentApplicationDto[]
  readonly childCommentsCount: number
}