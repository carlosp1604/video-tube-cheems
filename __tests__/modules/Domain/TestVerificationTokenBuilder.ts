import { DateTime } from 'luxon'
import { VerificationToken, VerificationTokenType } from '~/modules/Auth/Domain/VerificationToken'

/**
 * Verification Token model builder for tests
 */
export class TestVerificationTokenBuilder {
  private id: string
  private token: string
  private userEmail: string
  private type: VerificationTokenType
  private expiresAt: DateTime
  private createdAt: DateTime

  constructor () {
    this.id = 'test-user-id'
    this.token = 'test-user-name'
    this.userEmail = 'test@test.es'
    this.type = VerificationTokenType.VERIFY_EMAIL
    this.expiresAt = DateTime.now()
    this.createdAt = DateTime.now()
  }

  public build (): VerificationToken {
    return new VerificationToken(
      this.id,
      this.token,
      this.userEmail,
      this.type,
      this.expiresAt,
      this.createdAt
    )
  }

  public withId (id: string): TestVerificationTokenBuilder {
    this.id = id

    return this
  }

  public withToken (token: string): TestVerificationTokenBuilder {
    this.token = token

    return this
  }

  public withType (type: VerificationTokenType): TestVerificationTokenBuilder {
    this.type = type

    return this
  }

  public withUserEmail (userEmail: string): TestVerificationTokenBuilder {
    this.userEmail = userEmail

    return this
  }

  public withCreatedAt (createdAt: DateTime): TestVerificationTokenBuilder {
    this.createdAt = createdAt

    return this
  }

  public withExpiresAt (expiresAt: DateTime): TestVerificationTokenBuilder {
    this.expiresAt = expiresAt

    return this
  }
}
