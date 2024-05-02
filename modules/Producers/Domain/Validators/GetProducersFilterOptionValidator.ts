
import { Validator } from '~/modules/Shared/Domain/Validator'
import { ValidationException } from '~/modules/Shared/Domain/ValidationException'
import {
  GetProducersFilterStringTypeOption,
  GetProducersFilterStringTypeOptions
} from '~/modules/Producers/Domain/ProducerFilterOption'

export class GetProducersFilterOptionValidator implements Validator<GetProducersFilterStringTypeOption> {
  public validate (type: string): GetProducersFilterStringTypeOption {
    const exists = GetProducersFilterStringTypeOptions.find((option) => option === type)

    if (!exists) {
      throw ValidationException.invalidFilterType(type)
    }

    // NOTE: We are sure filter type accomplish with a valid values
    return type as GetProducersFilterStringTypeOption
  }
}
