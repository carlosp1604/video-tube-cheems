import { Account } from '~/modules/Auth/Domain/Account'

export interface AccountRepositoryInterface {
  /**
   * Insert an Account in the database if not exists
   * @param account Account to insert
   */
  createIfNotExists(account: Account): Promise<void>
}
