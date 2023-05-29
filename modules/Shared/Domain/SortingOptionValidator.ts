import { RepositoryFilterStringTypeOption } from '~/modules/Shared/Domain/RepositoryFilterOption'
import { Validator } from '~/modules/Shared/Domain/Validator'
import { ValidationException } from '~/modules/Shared/Domain/ValidationException'
import { RepositorySortingOptions } from '~/modules/Shared/Domain/RepositorySorting'

export class SortingOptionValidator implements Validator<RepositorySortingOptions> {
  public validate (option: string): RepositorySortingOptions {
    const validSortingOptions: string[] = Object.values(RepositorySortingOptions)

    if (!validSortingOptions.includes(option)) {
      throw ValidationException.invalidSortingOption(option)
    }

    // NOTE: We are sure filter type accomplish with a valid values
    return option as RepositorySortingOptions
  }
}
