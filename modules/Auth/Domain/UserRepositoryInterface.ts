import { User } from './User'

export interface UserRepositoryInterface {
  /**
   * Insert a User in the database
   * @param user User to insert
   */
  save(user: User): Promise<void>

  /**
   * Find a User given its email
   * @param userEmail User's email
   * @return User if found or null
   */
  findByEmail(userEmail: User['email']): Promise<User | null>

  /**
   * Find a User given its User ID
   * @param userId User's ID
   * @return User if found or null
   */
  findById(userId: User['id']): Promise<User | null>

  /**
   * Update a User in the database
   * @param user User to update
   */
  update(user: User): Promise<void>

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