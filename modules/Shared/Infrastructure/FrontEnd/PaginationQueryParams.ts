import { ParsedUrlQuery } from 'querystring'
import {
  ComponentSortingOption
} from '~/components/SortingMenuDropdown/ComponentSortingOptions'
import {
  fromOrderTypeToComponentSortingOption,
  PaginationSortingType
} from '~/modules/Shared/Infrastructure/FrontEnd/PaginationSortingType'

export interface PaginationNumericParameterConfiguration {
  defaultValue: number
  maxValue: number
  minValue: number
}

export interface PaginationSortingOptionParameterConfiguration<T extends PaginationSortingType> {
  defaultValue: T
  parseableOptionTypes: T[]
}

export interface PaginationConfiguration<T extends PaginationSortingType> {
  page: PaginationNumericParameterConfiguration
  perPage: PaginationNumericParameterConfiguration
  sortingOptionType: PaginationSortingOptionParameterConfiguration<T>
}

// TODO: Consider to extract common methods or make some of them generic
export class PaginationQueryParams<T extends PaginationSortingType> {
  private configuration: Partial<PaginationConfiguration<T>>
  public readonly page: number | null
  public readonly perPage: number | null
  public readonly sortingOptionType: T | null
  private _parseFailed = false

  constructor (
    query: ParsedUrlQuery,
    configuration: Partial<PaginationConfiguration<T>>
  ) {
    this.configuration = configuration
    this.page = this.parsePage(query)
    this.perPage = this.parsePerPage(query)
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

  private parseSortingOption (query: ParsedUrlQuery): T | null {
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
      return parseOrderBy as T
    }

    this._parseFailed = true

    return this.configuration.sortingOptionType.defaultValue
  }

  get parseFailed (): boolean {
    return this._parseFailed
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

    return queries.join('&')
  }

  private parseNumber (value: string): number | null {
    if (isNaN(Number(value))) {
      return null
    }

    return parseInt(value)
  }
}
