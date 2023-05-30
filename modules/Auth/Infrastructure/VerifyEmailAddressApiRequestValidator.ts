import { z, ZodError } from 'zod'
import { UserApiValidationException } from '~/modules/Auth/Infrastructure/UserApiValidationException'
import {
  VerifyEmailAddressApiRequestInterface
} from '~/modules/Auth/Infrastructure/VerifyEmailAddressApiRequestInterface'

export class VerifyEmailAddressApiRequestValidator {
  private static verifyEmailAddressApiRequestSchema = z.object({
    email: z.string().email().min(1),
    sendNewToken: z.boolean(),
  })

  public static validate (request: VerifyEmailAddressApiRequestInterface): UserApiValidationException | void {
    try {
      this.verifyEmailAddressApiRequestSchema.parse(request)
    } catch (exception: unknown) {
      console.error(exception)
      if (!(exception instanceof ZodError)) {
        throw exception
      }

      return UserApiValidationException.verifyEmailAddressRequest(exception.issues)
    }
  }
}
