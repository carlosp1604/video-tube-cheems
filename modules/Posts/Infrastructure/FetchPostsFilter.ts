import { PostFilterOptions } from '~/modules/Posts/Infrastructure/PostFilterOptions'

export interface FetchPostsFilter {
  type: PostFilterOptions
  value: string
}
