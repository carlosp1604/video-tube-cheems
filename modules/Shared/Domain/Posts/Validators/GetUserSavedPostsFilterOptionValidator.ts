import {
  GetUserSavedPostsFilterStringTypeOption,
  GetUserSavedPostsFilterStringTypeOptions
} from '~/modules/Shared/Domain/Posts/PostFilterOption'
import { Validator } from '~/modules/Shared/Domain/Validator'
import { ValidationException } from '~/modules/Shared/Domain/ValidationException'

export class GetUserSavedPostsFilterOptionValidator implements Validator<GetUserSavedPostsFilterStringTypeOption> {
  public validate (value: string): GetUserSavedPostsFilterStringTypeOption {
    const exists = GetUserSavedPostsFilterStringTypeOptions.find((option) => option === value)

    if (!exists) {
      throw ValidationException.invalidFilterType(value)
    }

    // NOTE: We are sure filter type accomplish with a valid values
    return value as GetUserSavedPostsFilterStringTypeOption
  }
}
