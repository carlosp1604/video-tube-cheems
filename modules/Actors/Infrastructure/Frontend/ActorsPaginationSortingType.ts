import { PaginationSortingType } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationSortingType'

export type ActorsPaginationSortingType = Extract<PaginationSortingType,
  PaginationSortingType.NAME_FIRST |
  PaginationSortingType.NAME_LAST |
  PaginationSortingType.MORE_POSTS |
  PaginationSortingType.LESS_POSTS
>
