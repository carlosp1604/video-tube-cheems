import { DateTime } from 'luxon'

export class Account {
  // eslint-disable-next-line no-useless-constructor
  public constructor (
    public readonly id: string,
    public readonly userId: string,
    public readonly type: string,
    public readonly provider: string,
    public readonly providerAccountId: string,
    public readonly refreshToken: string | null,
    public readonly accessToken: string | null,
    public readonly expiresAt: number | null,
    public readonly tokenType: string | null,
    public readonly scope: string | null,
    public readonly idToken: string | null,
    public readonly sessionState: string | null,
    public readonly createdAt: DateTime,
    public readonly updatedAt: DateTime
  ) {}
}
