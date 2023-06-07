import {
  ChangeUserPasswordApiRequestInterface
} from '~/modules/Auth/Infrastructure/Dtos/ChangeUserPasswordApiRequestInterface'
import { ChangeUserPasswordApplicationRequest } from '~/modules/Auth/Application/RetrieveUserPassword/ChangeUserPasswordApplicationRequest'

export class ChangeUserPasswordApplicationRequestTranslator {
  public static fromApi (apiRequest: ChangeUserPasswordApiRequestInterface): ChangeUserPasswordApplicationRequest {
    return {
      email: apiRequest.email,
      password: apiRequest.password,
      token: apiRequest.token,
    }
  }
}
