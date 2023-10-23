import { z, ZodError } from 'zod'
import { UserApiValidationException } from '~/modules/Auth/Infrastructure/Api/Validators/UserApiValidationException'

export class GetUserByUsernameApiRequestValidator {
  private static usernameValidator = z.string().min(1).regex(/^[a-zA-Z0-9_]+$/)

  public static validate (username: string): UserApiValidationException | void {
    try {
      this.usernameValidator.parse(username)
    } catch (exception: unknown) {
      if (!(exception instanceof ZodError)) {
        throw exception
      }

      return UserApiValidationException.getUserByUsernameRequest(exception.issues)
    }
  }
}
