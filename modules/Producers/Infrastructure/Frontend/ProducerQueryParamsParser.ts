import {
  QueryParamsParser,
  QueryParamsParserConfiguration
} from '~/modules/Shared/Infrastructure/FrontEnd/QueryParamsParser'
import { ParsedUrlQuery } from 'querystring'
import { FetchFilter } from '~/modules/Shared/Infrastructure/FrontEnd/FetchFilter'
import { ProducerFilterOptions } from '~/modules/Producers/Infrastructure/Frontend/ProducerFilterOptions'
import {
  ProducersPaginationSortingType
} from '~/modules/Producers/Infrastructure/Frontend/ProducersPaginationSortingType'

export class ProducerQueryParamsParser
  extends QueryParamsParser<ProducerFilterOptions, ProducersPaginationSortingType> {
  // eslint-disable-next-line no-useless-constructor
  constructor (
    query: ParsedUrlQuery,
    configuration: Partial<QueryParamsParserConfiguration<ProducerFilterOptions, ProducersPaginationSortingType>>
  ) {
    super(query, configuration)
  }

  protected parseFilters (query: ParsedUrlQuery): FetchFilter<ProducerFilterOptions>[] {
    const filters: FetchFilter<ProducerFilterOptions> [] = []

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
