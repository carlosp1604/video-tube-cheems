import { PostCommentApplicationDto } from './PostCommentApplicationDto'

export interface PostWithChildCommentCountDto {
  postComment: PostCommentApplicationDto
  childrenNumber: number
}

export interface GetPostPostCommentsResponseDto {
  readonly postCommentsWithChildrenCount: PostWithChildCommentCountDto[]
  readonly postPostCommentsCount: number
}
