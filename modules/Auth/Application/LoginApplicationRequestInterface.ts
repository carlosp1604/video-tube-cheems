import { User } from '~/modules/Auth/Domain/User'

export interface LoginApplicationRequestInterface {
  email: User['email']
  password: User['password']
}