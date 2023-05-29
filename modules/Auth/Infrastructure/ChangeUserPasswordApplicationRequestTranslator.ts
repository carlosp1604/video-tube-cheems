import {
  ChangeUserPasswordApiRequestInterface
} from '~/modules/Auth/Infrastructure/ChangeUserPasswordApiRequestInterface'
import { ChangeUserPasswordApplicationRequest } from '~/modules/Auth/Application/ChangeUserPasswordApplicationRequest'

export class ChangeUserPasswordApplicationRequestTranslator {
  public static fromApi (apiRequest: ChangeUserPasswordApiRequestInterface): ChangeUserPasswordApplicationRequest {
    return {
      email: apiRequest.email,
      password: apiRequest.password,
      token: apiRequest.token,
    }
  }
}
