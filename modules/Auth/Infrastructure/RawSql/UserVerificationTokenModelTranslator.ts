import { UserVerificationTokenRawModel } from '~/modules/Auth/Infrastructure/RawModels/UserRawModel'
import { VerificationToken as PrismaVerificationTokenModel } from '@prisma/client'

export class UserVerificationTokenModelTranslator {
  public static fromRaw (rawModel: UserVerificationTokenRawModel): PrismaVerificationTokenModel {
    return {
      id: rawModel.verification_token_id,
      createdAt: rawModel.verification_token_created_at,
      token: rawModel.verification_token_token,
      type: rawModel.verification_token_type,
      userEmail: rawModel.verification_token_user_email,
      expiresAt: rawModel.verification_token_expires_at,
    }
  }
}
