import { PrismaUserModelTranslator } from './PrismaUserModelTranslator'
import { User } from '~/modules/Auth/Domain/User'
import { prisma } from '~/persistence/prisma'
import {
  FindByEmailOptions, FindByIdOptions,
  UserRepositoryInterface
} from '~/modules/Auth/Domain/UserRepositoryInterface'
import { Prisma } from '.prisma/client'
import UserInclude = Prisma.UserInclude;
import { DefaultArgs } from '@prisma/client/runtime/library'

export class MysqlUserRepository implements UserRepositoryInterface {
  /**
   * Insert a User in the database
   * Deletes existing verification token associated to user email
   * @param user User to insert
   */
  public async save (user: User): Promise<void> {
    const prismaUserRow = PrismaUserModelTranslator.toDatabase(user)

    await prisma.$transaction([
      prisma.user.create({
        data: {
          ...prismaUserRow,
        },
      }),

      prisma.verificationToken.delete({
        where: {
          userEmail: user.email,
        },
      }),
    ])
  }

  /**
   * Find a User given its email
   * @param userEmail User's email
   * @param options Options with the User's relationships to load
   * @return User if found or null
   */
  public async findByEmail (userEmail: User['email'], options: FindByEmailOptions[] = []): Promise<User | null> {
    const user = await prisma.user.findFirst({
      where: {
        deletedAt: null,
        email: userEmail,
      },
      include: {
        verificationToken: options.includes('verificationToken'),
      },
    })

    if (user === null) {
      return null
    }

    return PrismaUserModelTranslator.toDomain(user, options)
  }

  /**
   * Find a User given its username
   * @param username User's username
   * @return User if found or null
   */
  public async findByUsername (username: User['username']): Promise<User | null> {
    const user = await prisma.user.findFirst({
      where: {
        deletedAt: null,
        username,
      },
    })

    if (user === null) {
      return null
    }

    return PrismaUserModelTranslator.toDomain(user)
  }

  /**
   * Find a User given its User ID
   * @param userId User's ID
   * @param options Options with the User's relationships to load
   * @return User if found or null
   */
  public async findById (userId: User['id'], options: FindByIdOptions[] = []): Promise<User | null> {
    let queryIncludes: UserInclude<DefaultArgs> | undefined

    if (options.includes('savedPosts')) {
      queryIncludes = {
        savedPosts: {
          include: {
            post: true,
          },
        },
      }
    }

    const user = await prisma.user.findFirst({
      where: {
        deletedAt: null,
        id: userId,
      },
      include: queryIncludes,
    })

    if (user === null) {
      return null
    }

    return PrismaUserModelTranslator.toDomain(user, options)
  }

  /**
   * Update a User in the database
   * @param user User to update
   * @param deleteVerificationToken Decides whether user's verification token is removed
   */
  public async update (user: User, deleteVerificationToken = false): Promise<void> {
    const prismaUserModel = PrismaUserModelTranslator.toDatabase(user)

    await prisma.$transaction(async (transaction) => {
      await transaction.user.update({
        data: {
          ...prismaUserModel,
        },
        where: {
          id: user.id,
        },
      })

      if (deleteVerificationToken) {
        await transaction.verificationToken.delete({
          where: {
            userEmail: user.email,
          },
        })
      }
    })
  }

  /**
   * Check whether user exists given an email
   * @param email User email
   * @return true if a user with given email exists or false
   */
  public async existsByEmail (email: User['email']): Promise<boolean> {
    const userExists = await prisma.user.findFirst({
      where: {
        email,
      },
    })

    return userExists !== null
  }

  /**
   * Check whether user exists given a username
   * @param username User username
   * @return true if a user with given username exists or false
   */
  public async existsByUsername (username: User['username']): Promise<boolean> {
    const userExists = await prisma.user.findFirst({
      where: {
        username,
      },
    })

    return userExists !== null
  }
}
