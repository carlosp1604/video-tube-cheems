import { Validator } from '~/modules/Shared/Domain/Validator'
import { ValidationException } from '~/modules/Shared/Domain/ValidationException'
import {
  GetUserHistorySortingOption, GetUserHistorySortingOptions
} from '~/modules/Shared/Domain/Posts/PostSorting'

export class GetUserHistorySortingOptionValidator implements Validator<GetUserHistorySortingOption> {
  public validate (type: string): GetUserHistorySortingOption {
    const exists = GetUserHistorySortingOptions.find((option) => option === type)

    if (!exists) {
      throw ValidationException.invalidSortingOption(type)
    }

    return type as GetUserHistorySortingOption
  }
}
