import { FetchPostsFilter } from '~/modules/Posts/Infrastructure/FetchPostsFilter'
import { ParsedUrlQuery } from 'querystring'
import { PostFilterOptions } from '~/modules/Posts/Infrastructure/PostFilterOptions'
import { PostsPaginationOrderType } from '~/modules/Shared/Infrastructure/FrontEnd/PostsPaginationOrderType'

export interface PostsFilterParamTypeConfiguration {
  optional: boolean
  defaultValue: string
}

export interface PostsPaginationFiltersParameterConfiguration {
  filtersToParse: PostFilterOptions[]
}

export interface PostsPaginationSortingOptionParameterConfiguration {
  defaultValue: PostsPaginationOrderType
  parseableOptionTypes: PostsPaginationOrderType[]
}

export interface PostsPaginationConfiguration {
  filters: PostsPaginationFiltersParameterConfiguration
  filterParamType: PostsFilterParamTypeConfiguration
  sortingOptionType: PostsPaginationSortingOptionParameterConfiguration
}

export class PostsPaginationParams {
  private configuration: Partial<PostsPaginationConfiguration>
  public readonly page: number
  public readonly filterParamType: string | null
  public readonly filters: FetchPostsFilter[]
  public readonly sortingOptionType: PostsPaginationOrderType | null
  private _parseFailed = false

  constructor (
    query: ParsedUrlQuery,
    configuration: Partial<PostsPaginationConfiguration>
  ) {
    const { slug } = query

    this.configuration = configuration
    this.filters = this.defaultFilters()

    /** No params or more than 3 params -> default
     * /es/1 -> /es
     * /${locale}/${defaultMainFilter | null}/${defaultSortingOrder | null}/1 **/
    if (!slug || !Array.isArray(slug) || slug.length > 3) {
      this.page = this.defaultPage()
      this.sortingOptionType = this.defaultSortingOption()
      this.filterParamType = this.defaultFilterParamType()

      return
    }

    /**
     * Valid routes with 1 param:
     * /es/1
     * /es/latest
     * /es/producer-slug
     */
    if (slug.length === 1) {
      const numberParam = this.parseNumber(slug[0])

      /** First option: PageNumber -> /es/1 **/
      if (numberParam) {
        this.page = numberParam
        this.sortingOptionType = this.defaultSortingOption()
        this.filterParamType = this.defaultFilterParamType()

        return
      }

      /** Second option: SortingOption -> /es/latest **/
      if (configuration.sortingOptionType?.parseableOptionTypes.includes(slug[0] as PostsPaginationOrderType)) {
        this.sortingOptionType = slug[0] as PostsPaginationOrderType
        this.page = this.defaultPage()
        this.filterParamType = this.defaultFilterParamType()
      } else {
        /** Third option: FilterParamType -> /es/producer-slug **/
        this.sortingOptionType = this.defaultSortingOption()
        this.page = this.defaultPage()
        this.filterParamType = slug[0]
      }

      return
    }

    /**
     * Valid routes with 2 param:
     * /es/latest/producer-slug
     * /es/latest/2
     * /es/producer-slug/2
     */
    if (slug.length === 2) {
      /** First value is FilterParamType or SortingOption **/
      /** /es/latest/... **/
      if (configuration.sortingOptionType?.parseableOptionTypes.includes(slug[0] as PostsPaginationOrderType)) {
        this.sortingOptionType = slug[0] as PostsPaginationOrderType

        const numberParam = this.parseNumber(slug[1])

        /** /es/latest/2 **/
        if (numberParam) {
          this.page = numberParam
          this.filterParamType = this.defaultFilterParamType()
        } else {
          /** /es/latest/producer-slug **/
          this.page = this.defaultPage()
          this.filterParamType = slug[1]
        }
      } else {
        /** /es/producer-slug/2 **/
        this.sortingOptionType = this.defaultSortingOption()
        this.filterParamType = slug[1]

        const numberParam = this.parseNumber(slug[1])

        if (!numberParam) {
          this._parseFailed = true
          this.page = this.defaultPage()
        } else {
          this.page = numberParam
        }
      }

      return
    }

    /**
     * Valid routes with 3 param:
     * /es/latest/producer-slug/2
     */
    if (configuration.sortingOptionType?.parseableOptionTypes.includes(slug[0] as PostsPaginationOrderType)) {
      this.sortingOptionType = slug[0] as PostsPaginationOrderType

      const numberParam = this.parseNumber(slug[1])

      /** Not valid route -> /es/latest/1/some-producer **/
      if (numberParam) {
        this._parseFailed = true
        this.page = this.defaultPage()
        this.filterParamType = this.defaultFilterParamType()
      } else {
        this.filterParamType = slug[1]

        const lastNumberParam = this.parseNumber(slug[2])

        if (!lastNumberParam) {
          this.page = this.defaultPage()
          this._parseFailed = true
        } else {
          this.page = lastNumberParam
        }
      }
    } else {
      this._parseFailed = true
      this.page = this.defaultPage()
      this.sortingOptionType = this.defaultSortingOption()
      this.filterParamType = this.defaultFilterParamType()
    }
  }

  private parseFilters (query: ParsedUrlQuery): FetchPostsFilter[] {
    const filters: FetchPostsFilter [] = []

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

  get parseFailed (): boolean {
    return this._parseFailed
  }

  public getParsedQuery (locale: string): string {
    let pathname = `/${locale}/`

    if (this.sortingOptionType) {
      pathname = pathname + `${this.sortingOptionType}/`
    }

    if (this.filterParamType) {
      pathname = pathname + `${this.filterParamType}/`
    }

    if (this.page) {
      pathname = pathname + `${this.page}/`
    }

    // TODO: Add filters as queryParams
    return pathname
  }

  public static buildPathname (
    page: number,
    pageDefaultValue: number,
    order: PostsPaginationOrderType,
    orderDefaultValue: PostsPaginationOrderType,
    filterParamType: string | null
  ): string {
    let newPathname = '/'

    if (order !== orderDefaultValue) {
      newPathname = newPathname + `${order}/`
    }

    if (filterParamType) {
      newPathname = newPathname + `${filterParamType}/`
    }

    if (page !== pageDefaultValue) {
      newPathname = newPathname + `${page}/`
    }

    // TODO: Add filters as queryParams
    return newPathname
  }

  private defaultPage (): number {
    return 1
  }

  private defaultFilterParamType (): string | null {
    if (this.configuration.filterParamType) {
      if (!this.configuration.filterParamType.optional) {
        this._parseFailed = true
      }

      return this.configuration.filterParamType.defaultValue
    }

    return null
  }

  private defaultSortingOption (): PostsPaginationOrderType | null {
    if (this.configuration.sortingOptionType) {
      return this.configuration.sortingOptionType.defaultValue
    }

    return null
  }

  private defaultFilters (): FetchPostsFilter[] {
    return []
  }

  private parseNumber (value: string): number | null {
    if (isNaN(Number(value))) {
      return null
    }

    return parseInt(value)
  }
}
