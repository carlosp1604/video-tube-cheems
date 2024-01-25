import { Validator } from '~/modules/Shared/Domain/Validator'
import { ValidationException } from '~/modules/Shared/Domain/ValidationException'
import { GetProducersSortingOption, GetProducersSortingOptions } from '~/modules/Producers/Domain/ProducerSorting'

export class GetProducersSortingOptionValidator implements Validator<GetProducersSortingOption> {
  public validate (type: string): GetProducersSortingOption {
    const exists = GetProducersSortingOptions.find((option) => option === type)

    if (!exists) {
      throw ValidationException.invalidSortingOption(type)
    }

    // NOTE: We are sure filter type accomplish with a valid values
    return type as GetProducersSortingOption
  }
}
