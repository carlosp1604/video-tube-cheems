import { PaginationSortingType } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationSortingType'

export type PostsPaginationSortingType = Extract<PaginationSortingType,
  PaginationSortingType.MOST_VIEWED |
  PaginationSortingType.LATEST |
  PaginationSortingType.OLDEST |
  PaginationSortingType.NEWEST_SAVED |
  PaginationSortingType.OLDEST_SAVED |
  PaginationSortingType.NEWEST_VIEWED |
  PaginationSortingType.OLDEST_VIEWED
>
