import { PostFilterOptionsType } from '../../Posts/Infrastructure/PostFilters'

export type InfrastructureFilter<T> = {
  type: T,
  value: string
}

export type FetchPostsFilter = {
  type: PostFilterOptionsType,
  value: string | null
}
