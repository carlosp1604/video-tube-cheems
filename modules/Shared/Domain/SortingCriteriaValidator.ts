import { Validator } from '~/modules/Shared/Domain/Validator'
import { ValidationException } from '~/modules/Shared/Domain/ValidationException'
import { SortingCriteria, SortingCriteriaOptions } from '~/modules/Shared/Domain/SortingCriteria'

export class SortingCriteriaValidator implements Validator<SortingCriteria> {
  public validate (value: string): SortingCriteria {
    const exists = SortingCriteriaOptions.find((criteria) => criteria === value)

    if (!exists) {
      throw ValidationException.invalidSortingCriteria(value)
    }

    // NOTE: We are sure filter type accomplish with a valid values
    return value as SortingCriteria
  }
}
