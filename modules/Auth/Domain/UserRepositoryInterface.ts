import { User } from './User'

export type UserRepositoryOptions = 'verificationToken'

export type FindByEmailOptions = Extract<UserRepositoryOptions, 'verificationToken'>

export interface UserRepositoryInterface {
  /**
   * Insert a User in the database
   * Deletes existing verification token associated to user email
   * @param user User to insert
   */
  save(user: User): Promise<void>

  /**
   * Find a User given its email
   * @param userEmail User's email
   * @param options Options with the User's relationships to load
   * @return User if found or null
   */
  findByEmail(userEmail: User['email'], options?: FindByEmailOptions[]): Promise<User | null>

  /**
   * Find a User given its username
   * @param username User's username
   * @return User if found or null
   */
  findByUsername(username: User['username']): Promise<User | null>

  /**
   * Find a User given its User ID
   * @param userId User's ID
   * @return User if found or null
   */
  findById(userId: User['id']): Promise<User | null>

  /**
   * Update a User in the database
   * @param user User to update
   * @param deleteVerificationToken Decides whether user's verification token is removed
   */
  update (user: User, deleteVerificationToken?: boolean): Promise<void>

  /**
   * Check whether user exists given an email
   * @param email User email
   * @return true if a user with given email exists or false
   */
  existsByEmail(email: User['email']): Promise<boolean>

  /**
   * Check whether user exists given a username
   * @param username User username
   * @return true if a user with given username exists or false
   */
  existsByUsername(username: User['username']): Promise<boolean>
}
