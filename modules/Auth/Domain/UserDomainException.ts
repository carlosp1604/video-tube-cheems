import { DomainException } from '~/modules/Exceptions/Domain/DomainException'
import { User } from '~/modules/Auth/Domain/User'
import { VerificationToken, VerificationTokenType } from '~/modules/Auth/Domain/VerificationToken'
import { Post } from '~/modules/Posts/Domain/Post'

export class UserDomainException extends DomainException {
  public static userHasAlreadyAnActiveTokenId = 'user_user_has_already_an_active_token'
  public static userHasNotAVerificationTokenId = 'user_user_has_not_a_verification_token'
  public static verificationTokenIsNotValidForId = 'user_verification_token_is_not_valid_for'
  public static cannotAddVerificationTokenId = 'user_cannot_add_verification_token'
  public static cannotCreateVerificationTokenId = 'user_cannot_create_verification_token'
  public static cannotRemoveVerificationTokenId = 'user_cannot_remove_verification_token'
  public static cannotAddVerificationTokenToAccountCreationId = 'user_cannot_verification_token_to_account_creation'
  public static tokenDoesNotMatchId = 'user_token_does_not_match'
  public static postAlreadySavedId = 'user_post_already_saved'
  public static postDoesNotExisOnSavedPostsId = 'user_post_does_not_exists_on_saved_posts'
  public static cannotDeletePostFromSavedPostsId = 'user_cannot_delete_post_from_saved_posts'

  constructor (message: string, id: string) {
    super(message, id)

    Object.setPrototypeOf(this, UserDomainException.prototype)
  }

  public static userHasAlreadyAnActiveToken (userId: User['id']): UserDomainException {
    return new UserDomainException(
      `User with ID ${userId} has already an active token`,
      this.userHasAlreadyAnActiveTokenId
    )
  }

  public static cannotAddVerificationToken (userId: User['id']): UserDomainException {
    return new UserDomainException(
      `Cannot add verification token to user with ID ${userId}`,
      this.cannotAddVerificationTokenId
    )
  }

  public static cannotCreateVerificationToken (userEmail: User['email']): UserDomainException {
    return new UserDomainException(
      `Cannot create verification token for email ${userEmail}`,
      this.cannotCreateVerificationTokenId
    )
  }

  public static cannotRemoveVerificationToken (userId: User['id']): UserDomainException {
    return new UserDomainException(
      `Cannot remove verification token from user with ID ${userId}`,
      this.cannotRemoveVerificationTokenId
    )
  }

  public static cannotAddVerificationTokenToAccountCreation (userId: User['id']): UserDomainException {
    return new UserDomainException(
      `User with ID ${userId} cannot add an account creation verification token`,
      this.cannotAddVerificationTokenToAccountCreationId
    )
  }

  public static userHasNotAVerificationToken (userId: User['id']): UserDomainException {
    return new UserDomainException(
      `User with ID ${userId} has not a verification token`,
      this.userHasNotAVerificationTokenId
    )
  }

  public static verificationTokenIsNotValidFor (
    verificationTokenId: VerificationToken['id'],
    verificationTokenType: VerificationTokenType
  ): UserDomainException {
    return new UserDomainException(
      `Verification token with ID ${verificationTokenId} is not valid for ${verificationTokenType}`,
      this.verificationTokenIsNotValidForId
    )
  }

  public static tokenDoesNotMatch (token: VerificationToken['token']
  ): UserDomainException {
    return new UserDomainException(
      `Token value: ${token} does not match with existing token`,
      this.tokenDoesNotMatchId
    )
  }

  public static postAlreadySaved (postId: Post['id']): UserDomainException {
    return new UserDomainException(
      `Post with ID ${postId} was already saved`,
      this.postAlreadySavedId
    )
  }

  public static postDoesNotExistOnSavedPosts (postId: Post['id']): UserDomainException {
    return new UserDomainException(
      `Post with ID ${postId} does not exists on saved posts`,
      this.postDoesNotExisOnSavedPostsId
    )
  }

  public static cannotDeletePostFromSavedPosts (postId: Post['id']): UserDomainException {
    return new UserDomainException(
      `Post with ID ${postId} cannot be deleted from saved posts`,
      this.cannotDeletePostFromSavedPostsId
    )
  }
}
