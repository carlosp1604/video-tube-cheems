import { z, ZodError } from 'zod'
import { ProducerApiRequestValidatorError } from './ProducerApiRequestValidatorError'
import { maxPerPage, minPerPage } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationHelper'
import { UnprocessedGetProducersApiRequestDto } from '~/modules/Producers/Infrastructure/Api/GetProducersApiRequestDto'

export class GetProducersApiRequestValidator {
  private static getProducersApiRequestSchema = z.object({
    page: z.number().positive().min(0),
    filters: z.array(z.object({
      type: z.string().min(1),
      value: z.string().min(1),
    })),
    perPage: z.number().positive().min(minPerPage).max(maxPerPage),
    orderBy: z.string().min(1),
    order: z.string().min(1),
  })

  public static validate (request: UnprocessedGetProducersApiRequestDto): ProducerApiRequestValidatorError | void {
    try {
      this.getProducersApiRequestSchema.parse(request)
    } catch (exception: unknown) {
      if (!(exception instanceof ZodError)) {
        throw exception
      }

      return ProducerApiRequestValidatorError.getProducersValidation(exception.issues)
    }
  }
}
