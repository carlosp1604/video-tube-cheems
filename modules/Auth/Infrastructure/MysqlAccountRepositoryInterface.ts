import {AccountRepositoryInterface} from "~/modules/Auth/Domain/AccountRepositoryInterface";
import {Account} from "~/modules/Auth/Domain/Account";
import {prisma} from "~/persistence/prisma";
import {PrismaAccountModelTranslator} from "~/modules/Auth/Infrastructure/PrismaAccountModelTranslator";

export class MysqlAccountRepositoryInterface implements AccountRepositoryInterface {
  /**
   * Insert an Account in the database if not exists
   * @param account Account to insert
   */
  public async createIfNotExists(account: Account): Promise<void> {
    const prismaAccountModel = PrismaAccountModelTranslator.toDatabase(account)

    await prisma.account.upsert({
      where: {
        provider_providerAccountId: {
          providerAccountId: prismaAccountModel.providerAccountId,
          provider: prismaAccountModel.provider
        },
      },
      create: {
        ...prismaAccountModel
      },
      update: {
        ...prismaAccountModel
      }
    })
  }
}