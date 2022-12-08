import { UserRepositoryInterface } from '../Domain/UserRepositoryInterface'
import { UserModelTranslator } from './UserModelTranslator'
import knex from 'knex'
import { Model } from 'objection'
import * as knexConfig from '../../../knexfile'
import { User } from '../Domain/User'
import { ObjectionUserModel } from './ObjectionUserModel'

export class MysqlUserRepository implements UserRepositoryInterface {
  /**
   * Insert a User in the persistence layer
   * @param user User to insert
   */
  public async insert(user: User): Promise<void> {
    // TODO: Find a solution for this
    const knexInstance = knex(knexConfig)
    Model.knex(knexInstance)
    const userRow = UserModelTranslator.toDatabase(user)

    // TODO: Handle errors correctly
    await ObjectionUserModel.query()
      .insert({
        id: userRow.id,
        email: userRow.email,
        email_verified: userRow.email_verified,
        name: userRow.name,
        created_at: userRow.created_at,
        deleted_at: userRow.deleted_at,
        updated_at: userRow.updated_at,
        views_count: userRow.views_count,
        image_url: userRow.image_url,
        language: userRow.language
      })
  }

  /**
   * Find a User given its email
   * @param userEmail User's email
   * @return User if found or null
   */
  public async findByEmail(userEmail: User['email']): Promise<User | null> {
    const user = await ObjectionUserModel.query()
      .whereNull('deleted_at')
      .andWhere('email', '=', userEmail)

    if (user.length === 0) {
      return null
    }

    return UserModelTranslator.toDomain(user[0])
  }

  /**
   * Find a User given its email
   * @param userId User's ID
   * @return User if found or null
   */
  public async findById(userId: User['id']): Promise<User | null> {
    const user = await ObjectionUserModel.query()
      .whereNull('deleted_at')
      .andWhere('id', '=', userId)

    if (user.length === 0) {
      return null
    }

    return UserModelTranslator.toDomain(user[0])
  }

  /**
   * Update a User in the persistence layer
   * @param user User to update
   */
  public async update(user: User): Promise<void> {
    return Promise.resolve()
  }
}