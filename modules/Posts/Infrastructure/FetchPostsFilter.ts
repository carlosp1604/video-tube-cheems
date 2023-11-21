import { PostFilterOptions } from '~/modules/Posts/Infrastructure/PostFilterOptions'

export interface FetchPostsFilter {
  type: PostFilterOptions
  value: string
}

export const getFilter = (
  filterTypeToFind: PostFilterOptions,
  filters: FetchPostsFilter[]
): FetchPostsFilter | null => {
  const foundFilter = filters.find((filter) => filter.type === filterTypeToFind)

  if (!foundFilter) {
    return null
  }

  return foundFilter
}
