import { MailerSendUserEmailSender } from '~/modules/Auth/Infrastructure/MailerSendUserEmailSender'
import { TestVerificationTokenBuilder } from '~/__tests__/modules/Auth/Domain/TestVerificationTokenBuilder'
import { VerificationToken, VerificationTokenType } from '~/modules/Auth/Domain/VerificationToken'
import { EmailParams, MailerSend, Recipient, Sender } from 'mailersend'
import { EmailModule } from 'mailersend/lib/modules/Email.module'
import { VerificationTokenEmailTemplateId } from '~/modules/Auth/Domain/VerificationTokenEmailTemplate'

describe('~/modules/Auth/Infrastructure/MailerSendUserEmailSender.ts', () => {
  let mockedMailerSend : MailerSend
  const userEmail = 'test-email@test.es'
  let verificationToken: VerificationToken
  let expectedEmailParams: EmailParams

  const buildService = () => {
    return new MailerSendUserEmailSender(mockedMailerSend, 'some-from-address', 'some-brand-name')
  }

  beforeEach(() => {
    verificationToken = new TestVerificationTokenBuilder()
      .withUserEmail('test-email@test.es')
      .withToken('test-token')
      .withType(VerificationTokenType.CREATE_ACCOUNT)
      .build()

    const sendFrom = new Sender('some-from-address', 'some-brand-name')

    const recipients = [
      new Recipient('test-email@test.es'),
    ]

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
            value: 'some-brand-name',
          },
        ],
      },
    ]

    expectedEmailParams = new EmailParams()
      .setFrom(sendFrom)
      .setTo(recipients)
      .setVariables(variables)
      // TODO: Currently we only support spanish emails.
      // When we support more languages we should find the way to translate the whole message and the email subject
      .setSubject('Código de verificación')
      .setTemplateId(VerificationTokenEmailTemplateId)

    mockedMailerSend = {
      email: {
        send: jest.fn().mockImplementation(async () => {
          return Promise.resolve()
        }),
      } as unknown as EmailModule,
    } as unknown as MailerSend
  })

  describe('when everything goes well', () => {
    it('should call to mailersend correctly', async () => {
      const emailSender = buildService()

      await emailSender.sendEmailVerificationEmail(userEmail, verificationToken)

      expect(mockedMailerSend.email.send).toBeCalledWith(expectedEmailParams)
    })
  })

  describe('when there are failures', () => {
    it('should throw exception if mailersend throws an error', async () => {
      mockedMailerSend = {
        email: {
          send: jest.fn().mockImplementation(async () => {
            throw Error('Unexpected error')
          }),
        } as unknown as EmailModule,
      } as unknown as MailerSend

      const emailSender = buildService()

      await expect(emailSender.sendEmailVerificationEmail(userEmail, verificationToken))
        .rejects
        .toThrow()
    })
  })
})
