import {
  VerifyEmailAddressApiRequestInterface
} from '~/modules/Auth/Infrastructure/VerifyEmailAddressApiRequestInterface'
import {
  VerifyEmailAddressApplicationRequestInterface
} from '~/modules/Auth/Application/VerifyEmailAddressApplicationRequestInterface'

export class VerifyEmailAddressApplicationRequestTranslator {
  public static fromApi (
    apiRequest: VerifyEmailAddressApiRequestInterface
  ): VerifyEmailAddressApplicationRequestInterface {
    return {
      email: apiRequest.email,
      sendNewToken: apiRequest.sendNewToken,
    }
  }
}
