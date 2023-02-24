import { PostApplicationDto } from './PostApplicationDto'

export interface GetPostApplicationResponseDto {
  posts: PostApplicationDto[],
  pagesNumber: number
}