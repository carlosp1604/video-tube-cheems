export interface VerifyEmailAddressApiRequestInterface {
  type: string
  email: string
  sendNewToken: boolean
  locale: string
}
