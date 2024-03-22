import { PrismaUserModelTranslator } from './PrismaUserModelTranslator'
import { User } from '~/modules/Auth/Domain/User'
import { prisma } from '~/persistence/prisma'
import {
  FindByEmailOptions, FindByIdOptions,
  UserRepositoryInterface
} from '~/modules/Auth/Domain/UserRepositoryInterface'
import { Post } from '~/modules/Posts/Domain/Post'
import { UserWithRelationsRawModel } from '~/modules/Auth/Infrastructure/RawSql/UserRawModel'
import { SqlUserQueryBuilder } from '~/modules/Auth/Infrastructure/RawSql/SqlUserQueryBuilder'
import { MysqlUsersTranslatorService } from '~/modules/Auth/Infrastructure/MysqlUsersTranslatorService'
import {Account} from "~/modules/Auth/Domain/Account";
import {PrismaAccountModelTranslator} from "~/modules/Auth/Infrastructure/PrismaAccountModelTranslator";

export class MysqlUserRepository implements UserRepositoryInterface {
  /**
   * Insert a User in the database
   * Deletes existing verification token associated to user email
   * @param user User to insert
   */
  public async save (user: User): Promise<void> {
    const prismaModelUser = PrismaUserModelTranslator.toDatabase(user)
    const prismaAccountModels = user.accounts.map((account) => {
      return PrismaAccountModelTranslator.toDatabase(account)
    })

    await prisma.$transaction([
      prisma.$queryRaw`
        INSERT INTO users (
          id, 
          name, 
          username, 
          email, 
          image_url, 
          language, 
          password, 
          created_at, 
          updated_at, 
          deleted_at, 
          email_verified
        ) VALUES (
          ${prismaModelUser.id},
          ${prismaModelUser.name},
          ${prismaModelUser.username},
          ${prismaModelUser.email},
          ${prismaModelUser.imageUrl},
          ${prismaModelUser.language},
          ${prismaModelUser.password},
          ${prismaModelUser.createdAt},
          ${prismaModelUser.updatedAt},
          ${prismaModelUser.deletedAt},
          ${prismaModelUser.emailVerified}
        );
      `,

      prisma.$queryRaw`
        DELETE
        FROM verification_tokens
        WHERE user_email = ${prismaModelUser.email};
      `,

      prisma.account.createMany({
        data: prismaAccountModels.map((prismaAccountModel) => {
          return {
            ...prismaAccountModel
          }
        })
      })
    ])
  }

  /**
   * Find a User given its email
   * @param userEmail User's email
   * @param options Options with the User's relationships to load
   * @return User if found or null
   */
  public async findByEmail (userEmail: User['email'], options: FindByEmailOptions[] = []): Promise<User | null> {
    const findByIdQuery = SqlUserQueryBuilder.findUserByEmail(userEmail, options)

    const users: Array<UserWithRelationsRawModel> = await prisma.$queryRaw(findByIdQuery)

    if (users.length === 0) {
      return null
    }

    return new MysqlUsersTranslatorService(options).fromRowsToDomain(users)[0]
  }

  /**
   * Find a User given its account data
   * @param provider Account Provider
   * @param providerAccountId Provider Account ID
   * @return User if found or null
   */
  public async findByAccountData(provider: Account['provider'], providerAccountId: Account['providerAccountId']): Promise<User | null> {
    const user = await prisma.user.findFirst({
      where: {
        accounts: {
          some: {
            provider,
            providerAccountId
          }
        }
      }
    })

    if (user === null) {
      return null
    }

    return PrismaUserModelTranslator.toDomain(user)
  }


  /**
   * Find a User given its username
   * @param username User's username
   * @return User if found or null
   */
  public async findByUsername (username: User['username']): Promise<User | null> {
    const users: [] = await prisma.$queryRaw`
      SELECT *
      FROM users
      WHERE username = ${username}
        AND deleted_at IS NULL;
    `

    if (users.length === 0) {
      return null
    }

    return new MysqlUsersTranslatorService([]).fromRowsToDomain(users)[0]
  }

  /**
   * Find a User given its User ID
   * @param userId User's ID
   * @param options Options with the User's relationships to load
   * @return User if found or null
   */
  public async findById (userId: User['id'], options: FindByIdOptions[] = []): Promise<User | null> {
    const findByIdQuery = SqlUserQueryBuilder.findUserById(userId, options)

    const users: Array<UserWithRelationsRawModel> = await prisma.$queryRaw(findByIdQuery)

    if (users.length === 0) {
      return null
    }

    return new MysqlUsersTranslatorService(options).fromRowsToDomain(users)[0]
  }

  /**
   * Update a User in the database
   * @param user User to update
   * @param deleteVerificationToken Decides whether user's verification token is removed
   */
  public async update (user: User, deleteVerificationToken = false): Promise<void> {
    const prismaUserModel = PrismaUserModelTranslator.toDatabase(user)

    await prisma.$transaction(async (transaction) => {
      await transaction.$queryRaw`
        UPDATE users
        SET
          name = ${prismaUserModel.name},
          username = ${prismaUserModel.username},
          password = ${prismaUserModel.password},
          email = ${prismaUserModel.email},
          image_url = ${prismaUserModel.imageUrl},
          language = ${prismaUserModel.language},
          updated_at = ${prismaUserModel.updatedAt}
        WHERE id = ${prismaUserModel.id};
      `

      if (deleteVerificationToken) {
        await transaction.$queryRaw`
          DELETE 
          FROM verification_tokens
          WHERE user_email = ${prismaUserModel.email};
        `
      }
    })
  }

  /**
   * Check whether user exists given an email
   * @param email User email
   * @return true if a user with given email exists or false
   */
  public async existsByEmail (email: User['email']): Promise<boolean> {
    const usersMatches: [{ exists: boolean }] = await prisma.$queryRaw`
      SELECT EXISTS(SELECT * FROM users WHERE email = ${email})
    `

    return usersMatches[0].exists
  }

  /**
   * Check whether user exists given a username
   * @param username User username
   * @return true if a user with given username exists or false
   */
  public async existsByUsername (username: User['username']): Promise<boolean> {
    const usersMatches: [{ exists: boolean }] = await prisma.$queryRaw`
      SELECT EXISTS(SELECT * FROM users WHERE username = ${username})
    `

    return usersMatches[0].exists
  }

  /**
   * Add a post to the User's saved post list
   * @param userId User ID
   * @param postId Post ID
   */
  public async addPostToSavedPosts (userId: User['id'], postId: Post['id']): Promise<void> {
    await prisma.$queryRaw`
      INSERT INTO saved_posts (post_id, user_id)
      VALUES (${postId}, ${userId});
    `
  }

  /**
   * Delete a post from the User's saved post list
   * @param userId User ID
   * @param postId Post ID
   */
  public async deletePostFromSavedPosts (userId: User['id'], postId: Post['id']): Promise<void> {
    await prisma.$queryRaw`
      DELETE FROM saved_posts
      WHERE user_id = ${userId} 
        AND post_id = ${postId};
    `
  }
}
