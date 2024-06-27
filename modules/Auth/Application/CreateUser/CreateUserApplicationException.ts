import { ApplicationException } from '~/modules/Exceptions/Application/ApplicationException'
import { User } from '~/modules/Auth/Domain/User'

export class CreateUserApplicationException extends ApplicationException {
  public static usernameAlreadyRegisteredId = 'create_user_username_already_registered'
  public static emailAlreadyRegisteredId = 'create_user_email_already_registered'
  public static cannotCreateUserId = 'create_user_cannot_create_user'
  public static verificationTokenIsNotValidId = 'create_user_verification_token_is_not_valid'
  public static invalidUsernameId = 'create_user_invalid_username'
  public static invalidEmailId = 'create_user_invalid_email'
  public static invalidPasswordId = 'create_user_invalid_password'
  public static invalidNameId = 'create_user_invalid_name'

  constructor (message: string, id: string) {
    super(message, id)

    Object.setPrototypeOf(this, CreateUserApplicationException.prototype)
  }

  public static usernameAlreadyRegistered (username: User['username']): CreateUserApplicationException {
    return new CreateUserApplicationException(
      `Username: ${username} is already registered`,
      this.usernameAlreadyRegisteredId
    )
  }

  public static emailAlreadyRegistered (userEmail: User['email']): CreateUserApplicationException {
    return new CreateUserApplicationException(
      `Email: ${userEmail} is already registered`,
      this.emailAlreadyRegisteredId
    )
  }

  public static cannotCreateUser (userEmail: User['email']): CreateUserApplicationException {
    return new CreateUserApplicationException(
      `Could not create user with email ${userEmail}`,
      this.cannotCreateUserId
    )
  }

  public static verificationTokenIsNotValid (userEmail: User['email']): CreateUserApplicationException {
    return new CreateUserApplicationException(
      `Verification token associated to email ${userEmail} is not valid.`,
      this.verificationTokenIsNotValidId
    )
  }

  public static invalidEmail (userEmail: User['email']): CreateUserApplicationException {
    return new CreateUserApplicationException(
      `Invalid email: ${userEmail}`,
      this.invalidEmailId
    )
  }

  public static invalidUsername (username: User['username']): CreateUserApplicationException {
    return new CreateUserApplicationException(
      `Invalid username: ${username}`,
      this.invalidUsernameId
    )
  }

  public static invalidName (name: User['name']): CreateUserApplicationException {
    return new CreateUserApplicationException(
      `Invalid name: ${name}`,
      this.invalidNameId
    )
  }

  public static invalidPassword (password: User['password']): CreateUserApplicationException {
    return new CreateUserApplicationException(
      `Invalid password: ${password}`,
      this.invalidPasswordId
    )
  }
}
