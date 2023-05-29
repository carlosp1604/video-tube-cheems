import { UserEmailSenderInterface } from '~/modules/Auth/Domain/UserEmailSenderInterface'
import { User } from '~/modules/Auth/Domain/User'
import { VerificationToken } from '~/modules/Auth/Domain/VerificationToken'
import { SendTemplatedEmailCommand, SESClient } from '@aws-sdk/client-ses'

export class AWSUserEmailSender implements UserEmailSenderInterface {
  // eslint-disable-next-line no-useless-constructor
  constructor (
    private readonly sesClient: SESClient
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
    const sendEmailCommand = this.createSendTemplatedEmailCommand(userEmail, verificationToken)

    try {
      await this.sesClient.send(sendEmailCommand)
    } catch (exception: unknown) {
      console.log(exception)
      throw Error(`Could not send email to user with email ${userEmail}`)
    }
  }

  private createSendTemplatedEmailCommand (
    toAddress: string,
    verificationToken: VerificationToken
  ): SendTemplatedEmailCommand {
    const { env } = process

    const fromAddress = env.EMAIL_FROM_ADDRESS

    if (!fromAddress) {
      throw Error('Missing EMAIL_FROM_ADDRESS environment variable to build SendTemplatedEmailCommand.')
    }

    return new SendTemplatedEmailCommand({
      Destination: {
        CcAddresses: [],
        ToAddresses: [toAddress],
      },
      Template: verificationToken.type === 'verify-email' ? 'email-verification' : 'recover-password',
      TemplateData: JSON.stringify({ token: verificationToken.token }),
      Source: fromAddress,
    })
  }
}
