import {
  VerifyEmailAddressApiRequestInterface
} from '~/modules/Auth/Infrastructure/Dtos/VerifyEmailAddressApiRequestInterface'
import {
  VerifyEmailAddressApplicationRequestInterface
} from '~/modules/Auth/Application/VerifyEmailAddress/VerifyEmailAddressApplicationRequestInterface'

export class VerifyEmailAddressApplicationRequestTranslator {
  public static fromApi (
    apiRequest: VerifyEmailAddressApiRequestInterface
  ): VerifyEmailAddressApplicationRequestInterface {
    return {
      type: apiRequest.type,
      email: apiRequest.email,
      sendNewToken: apiRequest.sendNewToken,
      locale: apiRequest.locale,
    }
  }
}
