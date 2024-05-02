import {
  QueryParamsParser,
  QueryParamsParserConfiguration
} from '~/modules/Shared/Infrastructure/FrontEnd/QueryParamsParser'
import { ActorFilterOptions } from '~/modules/Actors/Infrastructure/Frontend/ActorFilterOptions'
import { ActorsPaginationSortingType } from '~/modules/Actors/Infrastructure/Frontend/ActorsPaginationSortingType'
import { ParsedUrlQuery } from 'querystring'
import { FetchFilter } from '~/modules/Shared/Infrastructure/FrontEnd/FetchFilter'

export class ActorQueryParamsParser extends QueryParamsParser<ActorFilterOptions, ActorsPaginationSortingType> {
  // eslint-disable-next-line no-useless-constructor
  constructor (
    query: ParsedUrlQuery,
    configuration: Partial<QueryParamsParserConfiguration<ActorFilterOptions, ActorsPaginationSortingType>>
  ) {
    super(query, configuration)
  }

  protected parseFilters (query: ParsedUrlQuery): FetchFilter<ActorFilterOptions>[] {
    const filters: FetchFilter<ActorFilterOptions> [] = []

    if (!this.configuration.filters) {
      return filters
    }

    for (const parseableFilter of this.configuration.filters.filtersToParse) {
      const filter = query[parseableFilter]

      if (!filter || (filter && Array.isArray(filter))) {
        continue
      }

      filters.push({
        type: parseableFilter,
        value: filter,
      })
    }

    return filters
  }
}
