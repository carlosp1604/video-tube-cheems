import { CommentApplicationDto } from './CommentApplicationDto'

export interface PostWithChildCommentCount {
  postComment: CommentApplicationDto
  childComments: number
}

export interface GetPostPostCommentsResponseDto {
  readonly commentWithChildCount: PostWithChildCommentCount[]
  readonly postPostCommentsCount: number
}
