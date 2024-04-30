import { z, ZodError } from 'zod'
import {
  ProducerApiRequestValidatorError
} from '~/modules/Producers/Infrastructure/Api/ProducerApiRequestValidatorError'

export class AddProducerViewRequestValidator {
  private static addProducerViewApiRequestSchema = z.object({
    producerId: z.string().uuid(),
  })

  public static validate (request: AddProducerViewRequestValidator): ProducerApiRequestValidatorError | void {
    try {
      this.addProducerViewApiRequestSchema.parse(request)
    } catch (exception: unknown) {
      if (!(exception instanceof ZodError)) {
        throw exception
      }

      return ProducerApiRequestValidatorError.addProducerViewValidation(exception.issues)
    }
  }
}
