import { UserRepositoryInterface } from '~/modules/Auth/Domain/UserRepositoryInterface'
import { User } from '~/modules/Auth/Domain/User'
import { UserApplicationDto } from '~/modules/Auth/Application/Dtos/UserApplicationDto'
import { UserApplicationDtoTranslator } from '~/modules/Auth/Application/Translators/UserApplicationDtoTranslator'
import {
  OauthLoginSignUpApplicationRequestDto
} from '~/modules/Auth/Application/OauthLoginSignUp/OauthLoginSignUpApplicationRequestDto'
import { randomUUID } from 'crypto'
import { Account } from '~/modules/Auth/Domain/Account'
import { DateTime } from 'luxon'
import { Relationship } from '~/modules/Shared/Domain/Relationship/Relationship'
import { Collection } from '~/modules/Shared/Domain/Relationship/Collection'
import { CryptoServiceInterface } from '~/helpers/Domain/CryptoServiceInterface'

export class OauthLoginSignUp {
  // eslint-disable-next-line no-useless-constructor
  constructor (
    private userRepository: UserRepositoryInterface,
    private cryptoService: CryptoServiceInterface
  ) {}

  public async loginOrSignup (request: OauthLoginSignUpApplicationRequestDto): Promise<UserApplicationDto> {
    const user = await this.getUser(request.provider, request.providerAccountId)

    if (user) {
      return UserApplicationDtoTranslator.fromDomain(user)
    }

    const userId = randomUUID()
    const accountId = randomUUID()
    const nowDate = DateTime.now()

    const userAccount = new Account(
      accountId,
      userId,
      request.type,
      request.provider,
      request.providerAccountId,
      request.refreshToken,
      request.accessToken,
      request.expiresAt,
      request.tokenType,
      request.scope,
      request.idToken,
      request.sessionState,
      nowDate,
      nowDate
    )

    const generatedUsername = this.cryptoService.randomString()

    const accountCollection: Collection<Account, string> = Collection.initializeCollection()

    accountCollection.addItem(userAccount, userAccount.provider + userAccount.providerAccountId)

    const createdUser = new User(
      userId,
      request.profile.name,
      generatedUsername,
      request.profile.email,
      request.profile.pictureUrl,
      request.profile.language,
      null,
      nowDate,
      nowDate,
      request.profile.emailVerified ? nowDate : null,
      null,
      Relationship.notLoaded(),
      Collection.notLoaded(),
      accountCollection
    )

    await this.userRepository.save(createdUser)

    return UserApplicationDtoTranslator.fromDomain(createdUser)
  }

  private async getUser (
    provider: OauthLoginSignUpApplicationRequestDto['provider'],
    providerAccountId: OauthLoginSignUpApplicationRequestDto['providerAccountId']
  ): Promise<User | null> {
    return await this.userRepository.findByAccountData(provider, providerAccountId)
  }
}
