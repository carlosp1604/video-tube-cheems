import { RepositoryFilterStringTypeOption } from '~/modules/Shared/Domain/RepositoryFilterOption'
import { Validator } from '~/modules/Shared/Domain/Validator'
import { ValidationException } from '~/modules/Shared/Domain/ValidationException'

export class FilterOptionValidator implements Validator<RepositoryFilterStringTypeOption> {
  public validate (type: string): RepositoryFilterStringTypeOption {
    const validFilterOptions: string[] = Object.values(RepositoryFilterStringTypeOption)

    if (!validFilterOptions.includes(type)) {
      throw ValidationException.invalidFilterType(type)
    }

    // NOTE: We are sure filter type accomplish with a valid values
    return type as RepositoryFilterStringTypeOption
  }
}
