import { Validator } from '~/modules/Shared/Domain/Validator'
import { ValidationException } from '~/modules/Shared/Domain/ValidationException'
import {
  GetUserSavedPostsSortingOption,
  GetUserSavedPostsSortingOptions
} from '~/modules/Shared/Domain/Posts/PostSorting'

export class GetUserSavedPostsSortingOptionValidator implements Validator<GetUserSavedPostsSortingOption> {
  public validate (type: string): GetUserSavedPostsSortingOption {
    const exists = GetUserSavedPostsSortingOptions.find((option) => option === type)

    if (!exists) {
      throw ValidationException.invalidSortingOption(type)
    }

    return type as GetUserSavedPostsSortingOption
  }
}
