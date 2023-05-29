import { User } from '~/modules/Auth/Domain/User'

export interface VerifyEmailAddressApplicationRequestInterface {
  email: User['email']
  sendNewToken: boolean
}
