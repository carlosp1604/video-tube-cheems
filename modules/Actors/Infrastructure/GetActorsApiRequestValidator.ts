import { z, ZodError } from 'zod'
import { ActorApiRequestValidatorError } from './ActorApiRequestValidatorError'
import { ActorFilterOptions } from './ActorFilter'
import { GetActorsApiRequestDto } from './GetActorsApiRequestDto'
import {
  InfrastructureSortingCriteria,
  InfrastructureSortingOptions
} from '~/modules/Shared/Infrastructure/InfrastructureSorting'
import { maxPerPage, minPerPage } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationHelper'

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
