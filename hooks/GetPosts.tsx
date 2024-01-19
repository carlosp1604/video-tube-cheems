import { useCallback, useState } from 'react'
import { PostsApiService } from '~/modules/Posts/Infrastructure/Frontend/PostsApiService'
import {
  InfrastructureSortingCriteria,
  InfrastructureSortingOptions
} from '~/modules/Shared/Infrastructure/InfrastructureSorting'
import { defaultPerPage } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationHelper'
import { FetchPostsFilter } from '~/modules/Shared/Infrastructure/FetchPostsFilter'
import { PostsPaginationSortingType } from '~/modules/Posts/Infrastructure/Frontend/PostsPaginationSortingType'
import { GetPostsApplicationResponse } from '~/modules/Posts/Application/Dtos/GetPostsApplicationDto'
import { fromOrderTypeToComponentSortingOption } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationSortingType'

export interface GetPostsInterface {
  loading: boolean
  getPosts: (
    page: number,
    order: PostsPaginationSortingType,
    filters: FetchPostsFilter[]
  ) => Promise<GetPostsApplicationResponse | null>
}

export function useGetPosts (): GetPostsInterface {
  const [loading, setLoading] = useState<boolean>(false)

  const fetchPosts = (
    page: number,
    orderCriteria: InfrastructureSortingCriteria,
    orderOption: InfrastructureSortingOptions,
    filters: FetchPostsFilter[]
  ) => {
    return (new PostsApiService())
      .getPosts(
        page,
        defaultPerPage,
        orderCriteria,
        orderOption,
        filters
      )
  }

  const getPosts = useCallback(async (
    page: number,
    order: PostsPaginationSortingType,
    filters: FetchPostsFilter[]
  ): Promise<GetPostsApplicationResponse | null> => {
    setLoading(true)

    const componentOrder = fromOrderTypeToComponentSortingOption(order)

    try {
      const posts = await fetchPosts(page, componentOrder.criteria, componentOrder.option, filters)

      return posts
    } catch (exception: unknown) {
      console.error(exception)

      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return { loading, getPosts }
}
