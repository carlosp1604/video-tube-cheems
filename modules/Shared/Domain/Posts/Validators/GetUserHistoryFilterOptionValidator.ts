import {
  GetUserHistoryFilterStringTypeOption, GetUserHistoryFilterStringTypeOptions
} from '~/modules/Shared/Domain/Posts/PostFilterOption'
import { Validator } from '~/modules/Shared/Domain/Validator'
import { ValidationException } from '~/modules/Shared/Domain/ValidationException'

export class GetUserHistoryFilterOptionValidator implements Validator<GetUserHistoryFilterStringTypeOption> {
  public validate (value: string): GetUserHistoryFilterStringTypeOption {
    const exists = GetUserHistoryFilterStringTypeOptions.find((option) => option === value)

    if (!exists) {
      throw ValidationException.invalidFilterType(value)
    }

    // NOTE: We are sure filter type accomplish with a valid values
    return value as GetUserHistoryFilterStringTypeOption
  }
}
