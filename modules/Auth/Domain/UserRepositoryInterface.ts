import { User } from './User'

export interface UserRepositoryInterface {
  /**
   * Insert a User in the persistence layer
   * @param user User to insert
   */
  insert(user: User): Promise<void>

  /**
   * Find a User given its email
   * @param userEmail User's email
   * @return User if found or null
   */
  findByEmail(userEmail: User['email']): Promise<User | null>

  /**
   * Find a User given its email
   * @param userId User's ID
   * @return User if found or null
   */
  findById(userId: User['id']): Promise<User | null>

  /**
   * Update a User in the persistence layer
   * @param user User to update
   */
  update(user: User): Promise<void>
}