import { Validator } from '~/modules/Shared/Domain/Validator'
import { ValidationException } from '~/modules/Shared/Domain/ValidationException'
import { GetPostsSortingOption, GetPostsSortingOptions } from '~/modules/Shared/Domain/Posts/PostSorting'

export class GetPostsSortingOptionValidator implements Validator<GetPostsSortingOption> {
  public validate (type: string): GetPostsSortingOption {
    const exists = GetPostsSortingOptions.find((option) => option === type)

    if (!exists) {
      throw ValidationException.invalidSortingOption(type)
    }

    // NOTE: We are sure filter type accomplish with a valid values
    return type as GetPostsSortingOption
  }
}
