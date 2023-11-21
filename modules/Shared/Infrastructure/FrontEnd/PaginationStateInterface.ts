import { PostsPaginationOrderType } from '~/modules/Shared/Infrastructure/FrontEnd/PostsPaginationOrderType'
import { FetchPostsFilter } from '~/modules/Posts/Infrastructure/FetchPostsFilter'

export interface PaginationStateInterface {
  page: number
  order: PostsPaginationOrderType
  filters: FetchPostsFilter[]
}
