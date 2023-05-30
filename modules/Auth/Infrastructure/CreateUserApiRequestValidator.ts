import { z, ZodError } from 'zod'
import { CreateUserApiRequestInterface } from '~/modules/Auth/Infrastructure/CreateUserApiRequestInterface'
import { UserApiValidationException } from '~/modules/Auth/Infrastructure/UserApiValidationException'

export class CreateUserApiRequestValidator {
  private static createUserApiRequestSchema = z.object({
    name: z.string().min(1),
    email: z.string().email().min(1),
    password: z.string().min(1),
    username: z.string().min(1).regex(/^[a-zA-Z0-9_]+$/),
    language: z.string().min(1),
    token: z.string().min(1),
  })

  public static validate (request: CreateUserApiRequestInterface): UserApiValidationException | void {
    try {
      this.createUserApiRequestSchema.parse(request)
    }
 catch (exception: unknown) {
      if (!(exception instanceof ZodError)) {
        throw exception
      }

      return UserApiValidationException.createUserValidation(exception.issues)
    }
  }
}
