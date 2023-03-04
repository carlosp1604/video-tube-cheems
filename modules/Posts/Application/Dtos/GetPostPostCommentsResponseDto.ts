import { CommentApplicationDto } from './CommentApplicationDto'

export interface PostWithChildComment {
  postComment: CommentApplicationDto,
  childComments: number
}

export interface GetPostPostCommentsRespondeDto {
  readonly commentwithChildComment: PostWithChildComment[]
  readonly postPostComments: number
}