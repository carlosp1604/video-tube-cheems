import { VerificationToken } from '~/modules/Auth/Domain/VerificationToken'
import { User } from '~/modules/Auth/Domain/User'

export interface UserEmailSenderInterface {
  /**
   * Sends an email with the verification token to the user identified by its email
   * @param userEmail User email address
   * @param verificationToken Token to send in then email
   */
  sendEmailVerificationEmail(
    userEmail: User['email'],
    verificationToken: VerificationToken
  ): Promise<void>
}
