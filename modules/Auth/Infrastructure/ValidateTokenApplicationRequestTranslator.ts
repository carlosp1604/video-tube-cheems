import { ValidateTokenApiRequestInterface } from '~/modules/Auth/Infrastructure/ValidateTokenApiRequestInterface'
import {
  ValidateTokenApplicationRequestInterface
} from '~/modules/Auth/Application/ValidateToken/ValidateTokenApplicationRequestInterface'

export class ValidateTokenApplicationRequestTranslator {
  public static fromApi (
    apiRequest: ValidateTokenApiRequestInterface
  ): ValidateTokenApplicationRequestInterface {
    return {
      userEmail: apiRequest.email,
      token: apiRequest.token,
    }
  }
}
