import { CommentApplicationDto } from './CommentApplicationDto'

export interface PostWithChildCommentCount {
  postComment: CommentApplicationDto,
  childComments: number
}

export interface GetPostPostCommentsRespondeDto {
  readonly commentwithChildCount: PostWithChildCommentCount[]
  readonly postPostCommentsCount: number
}