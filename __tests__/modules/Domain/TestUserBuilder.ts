import { DateTime } from 'luxon'
import { User } from '~/modules/Auth/Domain/User'

/**
 * User model builder for tests
 */
export class TestUserBuilder {
  private id: string
  private name: string
  private username: string
  private email: string
  private imageUrl: string | null
  private language: string
  private password: string
  private emailVerified: DateTime | null
  private createdAt: DateTime
  private updatedAt: DateTime
  private deletedAt: DateTime | null
  constructor () {
    this.id = 'test-user-id'
    this.name = 'test-user-name'
    this.username = 'test_user_username'
    this.email = 'test@email.es'
    this.imageUrl = null
    this.language = 'test-user-language'
    this.password = 'test-user-password'
    this.emailVerified = null
    this.createdAt = DateTime.now()
    this.updatedAt = DateTime.now()
    this.deletedAt = null
  }

  public build (): User {
    return new User(
      this.id,
      this.name,
      this.username,
      this.email,
      this.imageUrl,
      this.language,
      this.password,
      this.createdAt,
      this.updatedAt,
      this.emailVerified,
      this.deletedAt
    )
  }

  public withId (id: string): TestUserBuilder {
    this.id = id

    return this
  }

  public withName (name: string): TestUserBuilder {
    this.name = name

    return this
  }

  public withEmail (email: string): TestUserBuilder {
    this.email = email

    return this
  }

  public withUsername (username: string): TestUserBuilder {
    this.username = username

    return this
  }

  public withImageUrl (imageUrl: string | null): TestUserBuilder {
    this.imageUrl = imageUrl

    return this
  }

  public withLanguage (language: string): TestUserBuilder {
    this.language = language

    return this
  }

  public withCreatedAt (createdAt: DateTime): TestUserBuilder {
    this.createdAt = createdAt

    return this
  }

  public withDeletedAt (deletedAt: DateTime | null): TestUserBuilder {
    this.deletedAt = deletedAt

    return this
  }

  public withPassword (hashedPassword: string): TestUserBuilder {
    this.password = hashedPassword

    return this
  }

  public withUpdatedAt (updatedAt: DateTime): TestUserBuilder {
    this.updatedAt = updatedAt

    return this
  }

  public withEmailVerified (emailVerified: DateTime | null): TestUserBuilder {
    this.emailVerified = emailVerified

    return this
  }
}
