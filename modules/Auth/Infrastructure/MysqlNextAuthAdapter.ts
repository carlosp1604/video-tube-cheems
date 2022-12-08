import { Adapter, AdapterSession, AdapterUser, VerificationToken } from 'next-auth/adapters'
import { MysqlUserRepository } from './MysqlUserRepository'
import { UuidGenerator } from '../../../helpers/Domain/UuidGenerator'
import { User } from '../Domain/User'
import { DateTime } from 'luxon'

export default function MysqlNextAuthAdapter (): Adapter {
  const userRepository = new MysqlUserRepository()

  return {
    async createUser(user): Promise<AdapterUser> {
      const userId = UuidGenerator.get()
      // TODO: Handle userName and language correctly
      const userName = user.name ?? ''
      const language = 'en'
      const nowDate = DateTime.now()

      const userToInsert = new User(
        userId,
        userName,
        user.email,
        null,
        0,
        language,
        nowDate,
        nowDate,
        null,
        null
      )

      await userRepository.insert(userToInsert)

      return {
        id: userToInsert.id,
        email: userToInsert.email,
        name: userToInsert.name,
        emailVerified: null,
        image: null,
      }
    },
    async getUser(id): Promise<AdapterUser | null> {
      const user = await userRepository.findById(id)

      if (user === null) {
        return null
      }

      let emailVerified: Date | null = null

      if (user.emailVerified !== null) {
        emailVerified = user.emailVerified.toJSDate()
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.imageUrl,
        emailVerified
      }
    },
    async getUserByEmail(email): Promise<AdapterUser | null> {
      const user = await userRepository.findByEmail(email)

      if (user === null) {
        return null
      }

      let emailVerified: Date | null = null

      if (user.emailVerified !== null) {
        emailVerified = user.emailVerified.toJSDate()
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.imageUrl,
        emailVerified
      }
    },
    async getUserByAccount({
     providerAccountId,
     provider
    }): Promise<AdapterUser | null> {
      throw Error('Not implemented!')
    },
    async updateUser(user): Promise<AdapterUser> {
      if (user.id === undefined) {
        throw new Error('User id not found')
      }

      const domainUser = await userRepository.findById(user.id)

      if (domainUser === null) {
        throw new Error('User not found')
      }

      const updateUser = createUserFromAdapterUser(user, domainUser)

      await userRepository.update(updateUser)

      let emailVerified = null

      if (updateUser.emailVerified !== null) {
        emailVerified = updateUser.emailVerified.toJSDate()
      }

      return {
        id: updateUser.id,
        name: updateUser.name,
        email: updateUser.email,
        emailVerified,
        image: updateUser.imageUrl,
      }
    },
    async deleteUser(userId) {
      throw Error('Not implemented!')
    },
    async linkAccount(
      account
    ) {
      throw Error('Not implemented!')
    },
    async unlinkAccount({
      providerAccountId,
      provider
    }) {
      throw Error('Not implemented!')
    },
    async createSession({
      sessionToken,
      userId,
      expires
    }): Promise<AdapterSession> {
      throw Error('Not implemented!')
    },
    async getSessionAndUser(
      sessionToken
    ): Promise<{session: AdapterSession, user: AdapterUser} | null> {
      throw Error('Not implemented!')
    },
    async updateSession({
      sessionToken
    }): Promise<AdapterSession | null | undefined> {
      throw Error('Not implemented!')
    },
    async deleteSession(sessionToken) {
      throw Error('Not implemented!')
    },
    async createVerificationToken({
      identifier,
      expires,
      token
    }): Promise<VerificationToken | null | undefined> {
      throw Error('Not implemented!')
    },
    async useVerificationToken({
     identifier,
     token
    }): Promise<VerificationToken | null> {
      throw Error('Not implemented!')
    },
  }

  function createUserFromAdapterUser (
    adapterUser: Partial<AdapterUser>,
    domainUser: User
  ): User {
    let emailVerified = domainUser.emailVerified

    if (adapterUser.emailVerified) {
      emailVerified = DateTime.fromJSDate(adapterUser.emailVerified)
    }

    return new User(
      domainUser.id,
      adapterUser.name || domainUser.name,
      adapterUser.email || domainUser.email,
      adapterUser.image || domainUser.imageUrl,
      domainUser.viewsCount,
      domainUser.language,
      domainUser.createdAt,
      domainUser.updatedAt,
      emailVerified,
      domainUser.deletedAt
    )
  }
}