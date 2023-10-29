import { FetchPostsFilter } from '~/modules/Posts/Infrastructure/FetchPostsFilter'
import { ProducerComponentDto } from '~/modules/Producers/Infrastructure/Dtos/ProducerComponentDto'
import { GetPostsApplicationResponse } from '~/modules/Posts/Application/Dtos/GetPostsApplicationDto'
import { PostFilterOptions } from '~/modules/Posts/Infrastructure/PostFilterOptions'

const buildSearchParams = (
  pageNumber: number,
  perPage: number,
  postFilters: FetchPostsFilter[]
): URLSearchParams => {
  const params = new URLSearchParams()

  params.append('page', pageNumber.toString())
  params.append('perPage', perPage.toString())

  for (const filter of postFilters) {
    if (filter.value !== null) {
      params.append(filter.type, filter.value)
    }
  }

  return params
}

export const fetchPosts = async (
  pageNumber: number,
  perPage: number,
  producer: ProducerComponentDto | null,
  titleFilter: string | null
): Promise<GetPostsApplicationResponse> => {
  const filters: FetchPostsFilter[] = []

  filters.push({
    type: PostFilterOptions.PRODUCER_NAME,
    value: producer !== null ? producer.id : null,
  })
  filters.push({
    type: PostFilterOptions.POST_TITLE,
    value: titleFilter !== null ? titleFilter : null,
  })

  const params = buildSearchParams(pageNumber, perPage, filters).toString()

  return ((await fetch(`/api/posts?${params}`)).json())
}
