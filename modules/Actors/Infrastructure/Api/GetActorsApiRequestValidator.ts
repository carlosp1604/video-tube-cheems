import { z, ZodError } from 'zod'
import { ActorsApiRequestValidatorError } from './ActorsApiRequestValidatorError'
import { maxPerPage, minPerPage } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationHelper'
import { UnprocessedGetActorsApiRequestDto } from '~/modules/Actors/Infrastructure/Api/GetActorsApiRequestDto'

export class GetActorsApiRequestValidator {
  private static getActorsApiRequestSchema = z.object({
    page: z.number().positive().min(0),
    filters: z.array(z.object({
      type: z.string().min(1),
      value: z.string().min(1),
    })),
    perPage: z.number().positive().min(minPerPage).max(maxPerPage),
    orderBy: z.string().min(1),
    order: z.string().min(1),
  })

  public static validate (request: UnprocessedGetActorsApiRequestDto): ActorsApiRequestValidatorError | void {
    try {
      this.getActorsApiRequestSchema.parse(request)
    } catch (exception: unknown) {
      if (!(exception instanceof ZodError)) {
        throw exception
      }

      return ActorsApiRequestValidatorError.getActorsValidation(exception.issues)
    }
  }
}
