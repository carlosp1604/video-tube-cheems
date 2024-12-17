import { useCallback } from 'react'
import { PostsApiService } from '~/modules/Posts/Infrastructure/Frontend/PostsApiService'
import {
  InfrastructureSortingCriteria,
  InfrastructureSortingOptions
} from '~/modules/Shared/Infrastructure/InfrastructureSorting'
import { defaultPerPageWithoutAds } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationHelper'
import { FetchFilter } from '~/modules/Shared/Infrastructure/FrontEnd/FetchFilter'
import { PostsPaginationSortingType } from '~/modules/Posts/Infrastructure/Frontend/PostsPaginationSortingType'
import { GetPostsApplicationResponse } from '~/modules/Posts/Application/Dtos/GetPostsApplicationDto'
import { fromOrderTypeToComponentSortingOption } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationSortingType'
import { PostFilterOptions } from '~/modules/Posts/Infrastructure/Frontend/PostFilterOptions'

export interface GetPostsInterface {
  getPosts: (
    page: number,
    order: PostsPaginationSortingType,
    filters: FetchFilter<PostFilterOptions>[]
  ) => Promise<GetPostsApplicationResponse | null>
}

export function useGetPosts (): GetPostsInterface {
  const fetchPosts = (
    page: number,
    orderCriteria: InfrastructureSortingCriteria,
    orderOption: InfrastructureSortingOptions,
    filters: FetchFilter<PostFilterOptions>[]
  ) => {
    return (new PostsApiService())
      .getPosts(
        page,
        defaultPerPageWithoutAds,
        orderCriteria,
        orderOption,
        filters
      )
  }

  const getPosts = useCallback(async (
    page: number,
    order: PostsPaginationSortingType,
    filters: FetchFilter<PostFilterOptions>[]
  ): Promise<GetPostsApplicationResponse | null> => {
    const componentOrder = fromOrderTypeToComponentSortingOption(order)

    try {
      const posts = await fetchPosts(page, componentOrder.criteria, componentOrder.option, filters)

      return posts
    } catch (exception: unknown) {
      console.error(exception)

      return null
    }
  }, [])

  return { getPosts }
}
