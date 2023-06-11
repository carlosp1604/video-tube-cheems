import { SESClient } from '@aws-sdk/client-ses'
import { AWSUserEmailSender } from '~/modules/Auth/Infrastructure/AWSUserEmailSender'
import { VerificationToken, VerificationTokenType } from '~/modules/Auth/Domain/VerificationToken'
import { mock, mockReset } from 'jest-mock-extended'
import { TestVerificationTokenBuilder } from '~/__tests__/modules/Domain/TestVerificationTokenBuilder'

describe('~/modules/Auth/Infrastructure/AWSUserEmailSender.ts', () => {
  const mockedSesClient = mock<SESClient>()
  const userEmail = 'test-email@test.es'
  let verificationToken: VerificationToken

  const buildService = () => {
    return new AWSUserEmailSender(mockedSesClient, 'some-from-address', 'some-brand-name')
  }

  beforeEach(() => {
    mockReset(mockedSesClient)
    verificationToken = new TestVerificationTokenBuilder()
      .withUserEmail('test-email@test.es')
      .withToken('test-token')
      .withType(VerificationTokenType.CREATE_ACCOUNT)
      .build()

    mockedSesClient.send.mockImplementation(() => {
      Promise.resolve()
    })
  })

  describe('when everything goes well', () => {
    it('should call to aws ses correctly', async () => {
      const emailSender = buildService()

      await emailSender.sendEmailVerificationEmail(userEmail, verificationToken)

      expect(mockedSesClient.send).toBeCalledWith(
        expect.objectContaining({
          input: expect.objectContaining({
            Destination: {
              CcAddresses: [],
              ToAddresses: ['test-email@test.es'],
            },
            Source: 'some-from-address',
            Template: 'email-verification',
            TemplateData: JSON.stringify({
              token: 'test-token',
              brandName: 'some-brand-name',
            }),
          }),
        })
      )
    })
  })

  describe('when there are failures', () => {
    it('should throw exception if aws ses throws an error', async () => {
      mockedSesClient.send.mockImplementation(() => {
        throw new Error('')
      })

      const emailSender = buildService()

      await expect(emailSender.sendEmailVerificationEmail(userEmail, verificationToken))
        .rejects
        .toThrow()
    })
  })
})
