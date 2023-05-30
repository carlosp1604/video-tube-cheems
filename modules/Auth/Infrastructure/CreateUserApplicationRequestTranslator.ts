import { CreateUserApiRequestInterface } from '~/modules/Auth/Infrastructure/CreateUserApiRequestInterface'
import { CreateUserApplicationRequestInterface } from '~/modules/Auth/Application/CreateUser/CreateUserApplicationRequestInterface'

export class CreateUserApplicationRequestTranslator {
  public static fromApi (apiRequest: CreateUserApiRequestInterface): CreateUserApplicationRequestInterface {
    return {
      name: apiRequest.name,
      email: apiRequest.email,
      password: apiRequest.password,
      username: apiRequest.username,
      language: apiRequest.language,
      token: apiRequest.token,
    }
  }
}
