export interface GetPostsRequestDto {
  filter: string | null
  sortOption: 'date' | 'views'
  sortCriteria: 'asc' | 'desc'
  offset: number
  limit: number
}