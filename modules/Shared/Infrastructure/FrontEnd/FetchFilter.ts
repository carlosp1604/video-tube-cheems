import { FilterOptions } from '~/modules/Shared/Infrastructure/FrontEnd/FilterOptions'

export interface FetchFilter<T extends FilterOptions> {
  type: T
  value: string
}
