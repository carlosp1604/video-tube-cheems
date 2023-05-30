import { User } from '~/modules/Auth/Domain/User'
import { VerificationToken } from '~/modules/Auth/Domain/VerificationToken'

export interface ChangeUserPasswordApplicationRequest {
  readonly email: User['email']
  readonly password: User['password']
  readonly token: VerificationToken['token']
}
