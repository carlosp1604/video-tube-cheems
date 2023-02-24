import { UserRepositoryInterface } from '../Domain/UserRepositoryInterface'
import { UserModelTranslator } from './UserModelTranslator'
import { User } from '../Domain/User'
import { prisma } from '../../../persistence/prisma'

export class MysqlUserRepository implements UserRepositoryInterface {
  /**
   * Insert a User in the persistence layer
   * @param user User to insert
   */
  public async insert(user: User): Promise<void> {
    const prismaUserRow = UserModelTranslator.toDatabase(user)

    await prisma.user.create({
      data: {
        ...prismaUserRow
      }
    })
  }

  /**
   * Find a User given its email
   * @param userEmail User's email
   * @return User if found or null
   */
  public async findByEmail(userEmail: User['email']): Promise<User | null> {
    const user = await prisma.user.findFirst({
      where: {
        deletedAt: null,
        email: userEmail
      }
    })

    if (user === null) {
      return null
    }

    return UserModelTranslator.toDomain(user)
  }

  /**
   * Find a User given its email
   * @param userId User's ID
   * @return User if found or null
   */
  public async findById(userId: User['id']): Promise<User | null> {
    const user = await prisma.user.findFirst({
      where: {
        deletedAt: null,
        id: userId
      }
    })

    if (user === null) {
      return null
    }

    return UserModelTranslator.toDomain(user)
  }

  /**
   * Update a User in the persistence layer
   * @param user User to update
   */
  public async update(user: User): Promise<void> {
    // TODO: Implement this
    return Promise.resolve()
  }
}