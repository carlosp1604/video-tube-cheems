import { RecoverPasswordApiRequestInterface } from '~/modules/Auth/Infrastructure/RecoverPasswordApiRequestInterface'
import { RecoverPasswordApplicationRequest } from '~/modules/Auth/Application/RecoverPasswordApplicationRequest'

export class RecoverPasswordApplicationTranslator {
  public static fromApi (
    apiRequest: RecoverPasswordApiRequestInterface
  ): RecoverPasswordApplicationRequest {
    return {
      email: apiRequest.email,
      sendNewToken: apiRequest.sendNewToken,
    }
  }
}
