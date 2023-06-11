import { User } from '~/modules/Auth/Domain/User'
import { UserEmailSenderInterface } from '~/modules/Auth/Domain/UserEmailSenderInterface'
import { SendTemplatedEmailCommand, SESClient } from '@aws-sdk/client-ses'
import { VerificationToken } from '~/modules/Auth/Domain/VerificationToken'

export class AWSUserEmailSender implements UserEmailSenderInterface {
  // eslint-disable-next-line no-useless-constructor
  constructor (
    private readonly sesClient: SESClient,
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
    const sendEmailCommand = this.createSendTemplatedEmailCommand(userEmail, verificationToken)

    try {
      await this.sesClient.send(sendEmailCommand)
    } catch (exception: unknown) {
      console.error(exception)
      throw Error(`Could not send email to user with email ${userEmail}`)
    }
  }

  private createSendTemplatedEmailCommand (
    toAddress: string,
    verificationToken: VerificationToken
  ): SendTemplatedEmailCommand {
    return new SendTemplatedEmailCommand({
      Destination: {
        CcAddresses: [],
        ToAddresses: [toAddress],
      },
      Template: 'email-verification',
      TemplateData: JSON.stringify({
        token: verificationToken.token,
        brandName: this.emailBrandName,
      }),
      Source: this.emailFromAddress,
    })
  }
}
