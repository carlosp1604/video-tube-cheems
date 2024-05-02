import { ParsedUrlQuery } from 'querystring'
import {
  fromOrderTypeToComponentSortingOption,
  PaginationSortingType
} from '~/modules/Shared/Infrastructure/FrontEnd/PaginationSortingType'
import { FilterOptions } from '~/modules/Shared/Infrastructure/FrontEnd/FilterOptions'
import { ComponentSortingOption } from '~/components/SortingMenuDropdown/ComponentSortingOptions'
import { FetchFilter } from '~/modules/Shared/Infrastructure/FrontEnd/FetchFilter'

export interface NumericParameterConfiguration {
  defaultValue: number
  maxValue: number
  minValue: number
}

export interface FiltersParameterConfiguration<T extends FilterOptions> {
  filtersToParse: T[]
}

export interface SortingOptionParameterConfiguration<K extends PaginationSortingType> {
  defaultValue: K
  parseableOptionTypes: K[]
}

export interface QueryParamsParserConfiguration<T extends FilterOptions, K extends PaginationSortingType> {
  page: NumericParameterConfiguration
  perPage: NumericParameterConfiguration
  filters: FiltersParameterConfiguration<T>
  sortingOptionType: SortingOptionParameterConfiguration<K>
}

export abstract class QueryParamsParser<T extends FilterOptions, K extends PaginationSortingType> {
  protected configuration: Partial<QueryParamsParserConfiguration<T, K>>
  public readonly page: number | null
  public readonly perPage: number | null
  public readonly filters: FetchFilter<T>[]
  public readonly sortingOptionType: K | null
  protected _parseFailed = false

  constructor (
    query: ParsedUrlQuery,
    configuration: Partial<QueryParamsParserConfiguration<T, K>>
  ) {
    this.configuration = configuration
    this.page = this.parsePage(query)
    this.perPage = this.parsePerPage(query)
    this.filters = this.parseFilters(query)
    this.sortingOptionType = this.parseSortingOption(query)
  }

  private parsePage (query: ParsedUrlQuery): number | null {
    let parsedPage: number | null = null

    const { page } = query

    if (!page) {
      if (this.configuration.page) {
        return this.configuration.page.defaultValue
      }

      return null
    }

    if (Array.isArray(page)) {
      this._parseFailed = true
    } else {
      parsedPage = this.parseNumber(page)

      if (parsedPage === null) {
        this._parseFailed = true
      } else {
        if (this.configuration.page) {
          if (parsedPage > this.configuration.page.maxValue || parsedPage < this.configuration.page.minValue) {
            this._parseFailed = true
            parsedPage = null
          }
        }
      }
    }

    if (parsedPage === null && this.configuration.page) {
      parsedPage = this.configuration.page.defaultValue
    }

    return parsedPage
  }

  private parsePerPage (query: ParsedUrlQuery): number | null {
    let parsedPerPage: number | null = null

    const { perPage } = query

    if (!perPage) {
      if (this.configuration.perPage) {
        return this.configuration.perPage.defaultValue
      }

      return null
    }

    if (Array.isArray(perPage)) {
      this._parseFailed = true
    } else {
      parsedPerPage = this.parseNumber(perPage)

      if (parsedPerPage === null) {
        this._parseFailed = true
      } else {
        if (this.configuration.perPage) {
          if (
            parsedPerPage > this.configuration.perPage.maxValue ||
            parsedPerPage < this.configuration.perPage.minValue
          ) {
            this._parseFailed = true
            parsedPerPage = null
          }
        }
      }
    }

    if (parsedPerPage === null && this.configuration.perPage) {
      parsedPerPage = this.configuration.perPage.defaultValue
    }

    return parsedPerPage
  }

  protected abstract parseFilters (query: ParsedUrlQuery): FetchFilter<T>[]

  private parseSortingOption (query: ParsedUrlQuery): K | null {
    if (!this.configuration.sortingOptionType) {
      this._parseFailed = true

      return null
    }

    const { order } = query

    if (!order) {
      if (this.configuration.sortingOptionType) {
        return this.configuration.sortingOptionType.defaultValue
      }

      return null
    }

    if (Array.isArray(order)) {
      this._parseFailed = true

      return null
    }

    const parseOrderBy = String(order)

    const validOptionMatch = this.configuration.sortingOptionType.parseableOptionTypes.find(
      (optionToParse) => optionToParse === parseOrderBy)

    if (validOptionMatch) {
      return parseOrderBy as K
    }

    this._parseFailed = true

    return this.configuration.sortingOptionType.defaultValue
  }

  public getFilter (filterType: T): FetchFilter<T> | null {
    const foundFilter =
      this.filters.find((filter) => filter.type === filterType)

    if (!foundFilter) {
      return null
    }

    return foundFilter
  }

  get componentSortingOption (): ComponentSortingOption | null {
    if (this.sortingOptionType === null) {
      return null
    }

    return fromOrderTypeToComponentSortingOption(this.sortingOptionType)
  }

  public getParsedQueryString (): string {
    const queries: string[] = []

    if (
      this.page &&
      (!this.configuration.page ||
        this.configuration.page.defaultValue !== this.page)
    ) {
      queries.push(`page=${String(this.page)}`)
    }

    if (
      this.perPage &&
      (!this.configuration.perPage ||
        this.configuration.perPage.defaultValue !== this.perPage)
    ) {
      queries.push(`perPage=${String(this.perPage)}`)
    }

    if (
      this.sortingOptionType &&
      (!this.configuration.sortingOptionType ||
        this.configuration.sortingOptionType.defaultValue !== this.sortingOptionType)
    ) {
      queries.push(`order=${String(this.sortingOptionType)}`)
    }

    for (const filter of this.filters) {
      queries.push(`${filter.type}=${filter.value}`)
    }

    return queries.join('&')
  }

  get parseFailed (): boolean {
    return this._parseFailed
  }

  private parseNumber (value: string): number | null {
    if (isNaN(Number(value))) {
      return null
    }

    return parseInt(value)
  }
}
