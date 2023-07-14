import { User } from '~/modules/Auth/Domain/User'
import { UserEmailSenderInterface } from '~/modules/Auth/Domain/UserEmailSenderInterface'
import { VerificationToken } from '~/modules/Auth/Domain/VerificationToken'
import { EmailParams, MailerSend, Recipient, Sender } from 'mailersend'
import { VerificationTokenEmailTemplateId } from '~/modules/Auth/Domain/VerificationTokenEmailTemplate'

export class MailerSendUserEmailSender implements UserEmailSenderInterface {
  // eslint-disable-next-line no-useless-constructor
  constructor (
    private readonly mailerSend: MailerSend,
    private readonly emailFromAddress: string,
    private readonly emailBrandName: string
  ) {}

  /**
   * Sends an email with the verification token to the user identified by its email
   * @param userEmail User email address
   * @param verificationToken Token to send in then email
   */
  public async sendEmailVerificationEmail (
    userEmail: User['email'],
    verificationToken: VerificationToken
  ): Promise<void> {
    const sentFrom = new Sender(this.emailFromAddress, this.emailBrandName)

    const recipients = [
      new Recipient(userEmail),
    ]

    // TODO: This should evolve to a specific structure if we handle more email types. For the moment is OK
    const variables = [
      {
        email: userEmail,
        substitutions: [
          {
            var: 'token',
            value: verificationToken.token,
          },
          {
            var: 'brandName',
            value: this.emailBrandName,
          },
        ],
      },
    ]

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setVariables(variables)
      // TODO: Currently we only support spanish emails.
      // When we support more languages we should find the way to translate the whole message and the email subject
      .setSubject('Código de verificación')
      .setTemplateId(VerificationTokenEmailTemplateId)

    // TODO: Handle possible errors
    await this.mailerSend.email.send(emailParams)
  }
}
