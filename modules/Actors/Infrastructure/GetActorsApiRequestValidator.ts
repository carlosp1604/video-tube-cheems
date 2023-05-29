import { z, ZodError } from 'zod'
import { InfrastructureSortingCriteria, InfrastructureSortingOptions } from '../../Shared/Infrastructure/InfrastructureSorting'
import { maxPerPage, minPerPage } from '../../Shared/Infrastructure/Pagination'
import { ActorApiRequestValidatorError } from './ActorApiRequestValidatorError'
import { ActorFilterOptions } from './ActorFilter'
import { GetActorsApiRequestDto } from './GetActorsApiRequestDto'

export class GetActorsApiRequestValidator {
  private static getActorsApiRequestSchema = z.object({
    page: z.number().positive().min(0),
    postsPerPage: z.number().positive().min(minPerPage).max(maxPerPage),
    filters: z.array(z.object({
      type: z.nativeEnum(ActorFilterOptions),
      value: z.string().min(1),
    })),
    sortOption: z.nativeEnum(InfrastructureSortingOptions),
    sortCriteria: z.nativeEnum(InfrastructureSortingCriteria),
  })

  public static validate (request: GetActorsApiRequestDto): ActorApiRequestValidatorError | void {
    try {
      this.getActorsApiRequestSchema.parse(request)
    } catch (exception: unknown) {
      if (!(exception instanceof ZodError)) {
        throw exception
      }

      return ActorApiRequestValidatorError.getActorsValidation(exception.issues)
    }
  }
}
