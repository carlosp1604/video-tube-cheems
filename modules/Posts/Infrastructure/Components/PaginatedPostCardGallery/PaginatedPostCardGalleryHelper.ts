import {
  PaginatedPostCardGalleryTypes
} from '~/modules/Posts/Infrastructure/Components/PaginatedPostCardGallery/PaginatedPostCardGallery'
import {
  HomePostsDefaultSortingOption,
  SavedPostsDefaultSortingOption,
  SortingOption
} from '~/components/SortingMenuDropdown/SortingMenuDropdownOptions'
import { PostsApiService } from '~/modules/Posts/Infrastructure/Frontend/PostsApiService'
import { defaultPerPage } from '~/modules/Shared/Infrastructure/Pagination'
import { FetchPostsFilter } from '~/modules/Posts/Infrastructure/FetchPostsFilter'
import { GetPostsApplicationResponse } from '~/modules/Posts/Application/Dtos/GetPostsApplicationDto'
import { PostFilterOptions } from '~/modules/Posts/Infrastructure/PostFilterOptions'

export class PaginatedPostCardGalleryHelper {
  public static getDefaultSortingOption (type: PaginatedPostCardGalleryTypes) {
    if (type === PaginatedPostCardGalleryTypes.HOME) {
      return HomePostsDefaultSortingOption
    }

    // FIXME:
    return SavedPostsDefaultSortingOption
  }

  public static getPosts (
    type: PaginatedPostCardGalleryTypes,
    pageNumber: number,
    activeSortingOption: SortingOption,
    filters: FetchPostsFilter[]
  ): Promise<GetPostsApplicationResponse | null> {
    const apiService = new PostsApiService()

    if (type === PaginatedPostCardGalleryTypes.SAVED_POSTS) {
      const savedByFilter = filters.find((filter) => filter.type === PostFilterOptions.SAVED_BY)

      if (!savedByFilter || savedByFilter.value === null) {
        return Promise.resolve(null)
      }

      return apiService.getSavedPosts(
        savedByFilter.value,
        pageNumber,
        defaultPerPage,
        activeSortingOption.criteria,
        activeSortingOption.option,
        filters
      )
    }

    // FIXME:
    return apiService.getPosts(
      pageNumber,
      defaultPerPage,
      activeSortingOption.criteria,
      activeSortingOption.option,
      filters
    )
  }
}
