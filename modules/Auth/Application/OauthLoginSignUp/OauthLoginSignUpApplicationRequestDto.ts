export interface OauthProfileApplicationDto {
  email: string
  name: string
  pictureUrl: string | null
  language: string
  emailVerified: boolean
}

export interface OauthLoginSignUpApplicationRequestDto {
  profile: OauthProfileApplicationDto
  provider: string
  type: string
  providerAccountId: string
  accessToken: string | null
  refreshToken: string | null
  expiresAt: number | null
  tokenType: string | null
  scope: string | null
  idToken: string | null
  sessionState: string | null
}
