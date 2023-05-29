import { VerificationToken } from '~/modules/Auth/Domain/VerificationToken'

export interface ValidateTokenApplicationRequestInterface {
  token: VerificationToken['token']
  userEmail: VerificationToken['userEmail']
}
