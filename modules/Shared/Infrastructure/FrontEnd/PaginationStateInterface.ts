import { PostsPaginationSortingType } from '~/modules/Shared/Infrastructure/FrontEnd/PostsPaginationSortingType'
import { FetchPostsFilter } from '~/modules/Shared/Infrastructure/FetchPostsFilter'

export interface PaginationStateInterface {
  page: number
  order: PostsPaginationSortingType
  filters: FetchPostsFilter[]
}
