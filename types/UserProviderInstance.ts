import { UserProviderUserDto } from '../modules/Auth/Infrastructure/UserProviderUserDto'

export type UserStatus = 'SIGNED_OUT' | 'SIGNED_IN'

export interface UserInstance {
  status: UserStatus
  user: UserProviderUserDto | null
  updateUser: () => Promise<void>
}

export type UserProviderInstanceData = {
  userInstance: UserInstance
} | null
