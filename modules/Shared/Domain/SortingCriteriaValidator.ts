import { Validator } from '~/modules/Shared/Domain/Validator'
import { ValidationException } from '~/modules/Shared/Domain/ValidationException'
import { RepositorySortingCriteria, RepositorySortingOptions } from '~/modules/Shared/Domain/RepositorySorting'

export class SortingCriteriaValidator implements Validator<RepositorySortingCriteria> {
  public validate (criteria: string): RepositorySortingCriteria {
    const validSortingCriteria: string[] = Object.values(RepositorySortingCriteria)

    if (!validSortingCriteria.includes(criteria)) {
      throw ValidationException.invalidSortingCriteria(criteria)
    }

    // NOTE: We are sure filter type accomplish with a valid values
    return criteria as RepositorySortingCriteria
  }
}
