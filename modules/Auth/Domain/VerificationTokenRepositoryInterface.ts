import { VerificationToken } from '~/modules/Auth/Domain/VerificationToken'

export interface VerificationTokenRepositoryInterface {
  /**
   * Get a VerificationToken from the database given its user email and token values
   * @param userEmail VerificationToken User Email
   * @param token VerificationToken token
   * @returns VerificationToken if found or null
   */
  findByEmailAndToken(
    userEmail: VerificationToken['userEmail'],
    token: VerificationToken['token']
  ): Promise<VerificationToken | null>

  /**
   * Get a VerificationToken from the database given its user email
   * @param userEmail VerificationToken User Email
   * @returns VerificationToken if found or null
   */
  findByEmail(userEmail: VerificationToken['userEmail']): Promise<VerificationToken | null>

  /**
   * Persist a VerificationToken in the database
   * @param verificationToken VerificationToken to insert
   * @param deleteExisting Decides whether to delete existing token or not
   */
  save(verificationToken: VerificationToken, deleteExisting: boolean): Promise<void>

  /**
   * Remove a VerificationToken from the database
   * @param verificationToken VerificationToken to remove
   */
  delete(verificationToken: VerificationToken): Promise<void>
}
