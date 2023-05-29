import { UserModelTranslator } from './UserModelTranslator'
import { User } from '~/modules/Auth/Domain/User'
import { prisma } from '~/persistence/prisma'
import { UserRepositoryInterface } from '~/modules/Auth/Domain/UserRepositoryInterface'

export class MysqlUserRepository implements UserRepositoryInterface {
  /**
   * Insert a User in the database
   * @param user User to insert
   */
  public async save (user: User): Promise<void> {
    const prismaUserRow = UserModelTranslator.toDatabase(user)

    await prisma.user.create({
      data: {
        ...prismaUserRow,
      },
    })
  }

  /**
   * Find a User given its email
   * @param userEmail User's email
   * @return User if found or null
   */
  public async findByEmail (userEmail: User['email']): Promise<User | null> {
    const user = await prisma.user.findFirst({
      where: {
        deletedAt: null,
        email: userEmail,
      },
    })

    if (user === null) {
      return null
    }

    return UserModelTranslator.toDomain(user)
  }

  /**
   * Find a User given its User ID
   * @param userId User's ID
   * @return User if found or null
   */
  public async findById (userId: User['id']): Promise<User | null> {
    const user = await prisma.user.findFirst({
      where: {
        deletedAt: null,
        id: userId,
      },
    })

    if (user === null) {
      return null
    }

    return UserModelTranslator.toDomain(user)
  }

  /**
   * Update a User in the database
   * @param user User to update
   */
  public async update (user: User): Promise<void> {
    const prismaUserModel = UserModelTranslator.toDatabase(user)

    await prisma.user.update({
      data: {
        ...prismaUserModel,
      },
      where: {
        id: user.id,
      },
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
