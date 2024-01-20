import { Validator } from '~/modules/Shared/Domain/Validator'
import { ValidationException } from '~/modules/Shared/Domain/ValidationException'
import { GetActorsSortingOption, GetActorsSortingOptions } from '~/modules/Actors/Domain/ActorSorting'

export class GetActorsSortingOptionValidator implements Validator<GetActorsSortingOption> {
  public validate (type: string): GetActorsSortingOption {
    const exists = GetActorsSortingOptions.find((option) => option === type)

    if (!exists) {
      throw ValidationException.invalidSortingOption(type)
    }

    // NOTE: We are sure filter type accomplish with a valid values
    return type as GetActorsSortingOption
  }
}
