import { User } from '~/modules/Auth/Domain/User'

export interface VerifyEmailAddressApplicationRequestInterface {
  type: string
  email: User['email']
  sendNewToken: boolean
  locale: string
}
