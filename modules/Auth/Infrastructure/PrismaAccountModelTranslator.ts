import { DateTime } from 'luxon'
import { Account as PrismaAccountModel } from '@prisma/client'
import { Account } from '~/modules/Auth/Domain/Account'

export class PrismaAccountModelTranslator {
  public static toDomain (prismaAccountModel: PrismaAccountModel) {
    return new Account(
      prismaAccountModel.id,
      prismaAccountModel.userId,
      prismaAccountModel.type,
      prismaAccountModel.provider,
      prismaAccountModel.providerAccountId,
      prismaAccountModel.refresh_token,
      prismaAccountModel.access_token,
      prismaAccountModel.expires_at,
      prismaAccountModel.token_type,
      prismaAccountModel.scope,
      prismaAccountModel.id_token,
      prismaAccountModel.session_state,
      DateTime.fromJSDate(prismaAccountModel.createdAt),
      DateTime.fromJSDate(prismaAccountModel.updatedAt)
    )
  }

  public static toDatabase (account: Account): PrismaAccountModel {
    return {
      id: account.id,
      type: account.type,
      provider: account.provider,
      providerAccountId: account.providerAccountId,
      userId: account.userId,
      access_token: account.accessToken,
      expires_at: account.expiresAt,
      id_token: account.idToken,
      refresh_token: account.refreshToken,
      scope: account.scope,
      session_state: account.sessionState,
      token_type: account.tokenType,
      createdAt: account.createdAt.toJSDate(),
      updatedAt: account.updatedAt.toJSDate(),
    }
  }
}
