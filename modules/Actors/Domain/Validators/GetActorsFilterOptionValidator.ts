import { Validator } from '~/modules/Shared/Domain/Validator'
import { ValidationException } from '~/modules/Shared/Domain/ValidationException'
import {
  GetActorsFilterStringTypeOption,
  GetActorsFilterStringTypeOptions
} from '~/modules/Actors/Domain/ActorFilterOption'

export class GetActorsFilterOptionValidator implements Validator<GetActorsFilterStringTypeOption> {
  public validate (type: string): GetActorsFilterStringTypeOption {
    const exists = GetActorsFilterStringTypeOptions.find((option) => option === type)

    if (!exists) {
      throw ValidationException.invalidFilterType(type)
    }

    // NOTE: We are sure filter type accomplish with a valid values
    return type as GetActorsFilterStringTypeOption
  }
}
