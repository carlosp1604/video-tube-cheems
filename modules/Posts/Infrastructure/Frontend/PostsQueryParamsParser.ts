import { PostFilterOptions } from '~/modules/Posts/Infrastructure/Frontend/PostFilterOptions'
import { PostsPaginationSortingType } from '~/modules/Posts/Infrastructure/Frontend/PostsPaginationSortingType'
import {
  QueryParamsParser,
  QueryParamsParserConfiguration
} from '~/modules/Shared/Infrastructure/FrontEnd/QueryParamsParser'
import { ParsedUrlQuery } from 'querystring'
import { FetchFilter } from '~/modules/Shared/Infrastructure/FrontEnd/FetchFilter'
import { FilterOptions } from '~/modules/Shared/Infrastructure/FrontEnd/FilterOptions'

export class PostsQueryParamsParser extends QueryParamsParser<PostFilterOptions, PostsPaginationSortingType> {
  // eslint-disable-next-line no-useless-constructor
  constructor (
    query: ParsedUrlQuery,
    configuration: Partial<QueryParamsParserConfiguration<PostFilterOptions, PostsPaginationSortingType>>
  ) {
    super(query, configuration)
  }

  protected parseFilters (query: ParsedUrlQuery): FetchFilter<PostFilterOptions>[] {
    const filters: FetchFilter<PostFilterOptions> [] = []

    if (!this.configuration.filters) {
      return filters
    }

    for (const parseableFilter of this.configuration.filters.filtersToParse) {
      const filter = query[parseableFilter]

      if (!filter || (filter && Array.isArray(filter))) {
        continue
      }

      filters.push({
        type: PostsQueryParamsParser.getFilterAlias(parseableFilter),
        value: filter,
      })
    }

    return filters
  }

  public static getFilterAlias (filterOption: PostFilterOptions): PostFilterOptions {
    if (filterOption === FilterOptions.SEARCH) {
      return FilterOptions.POST_TITLE
    }

    return filterOption
  }
}
