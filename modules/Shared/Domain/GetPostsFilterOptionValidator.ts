import {
  GetPostsFilterStringTypeOption, GetPostsFilterStringTypeOptions
} from '~/modules/Shared/Domain/RepositoryFilterOption'
import { Validator } from '~/modules/Shared/Domain/Validator'
import { ValidationException } from '~/modules/Shared/Domain/ValidationException'

export class GetPostsFilterOptionValidator implements Validator<GetPostsFilterStringTypeOption> {
  public validate (type: string): GetPostsFilterStringTypeOption {
    const exists = GetPostsFilterStringTypeOptions.find((option) => option === type)

    if (!exists) {
      throw ValidationException.invalidFilterType(type)
    }

    // NOTE: We are sure filter type accomplish with a valid values
    return type as GetPostsFilterStringTypeOption
  }
}
