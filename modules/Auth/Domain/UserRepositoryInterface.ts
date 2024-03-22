import { User } from './User'
import { Post } from '~/modules/Posts/Domain/Post'
import {Account} from "~/modules/Auth/Domain/Account";

export type UserRepositoryOptions = 'verificationToken'| 'savedPosts'

export type FindByEmailOptions = Extract<UserRepositoryOptions, 'verificationToken'>

export type FindByIdOptions = Extract<UserRepositoryOptions, 'savedPosts'>

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
   * Find a User given its account data
   * @param provider Account Provider
   * @param providerAccountId Provider Account ID
   * @return User if found or null
   */
  findByAccountData(provider: Account['provider'], providerAccountId: Account['providerAccountId']): Promise<User | null>

  /**
   * Find a User given its username
   * @param username User's username
   * @return User if found or null
   */
  findByUsername(username: User['username']): Promise<User | null>

  /**
   * Find a User given its User ID
   * @param userId User's ID
   * @param options Options with the User's relationships to load
   * @return User if found or null
   */
  findById(userId: User['id'], options?:FindByIdOptions[]): Promise<User | null>

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

  /**
   * Add a post to the User's saved post list
   * @param userId User ID
   * @param postId Post ID
   */
  addPostToSavedPosts(userId: User['id'], postId: Post['id']): Promise<void>

  /**
   * Delete a post from the User's saved post list
   * @param userId User ID
   * @param postId Post ID
   */
  deletePostFromSavedPosts(userId: User['id'], postId: Post['id']): Promise<void>
}
