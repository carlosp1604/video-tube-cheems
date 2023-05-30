import { User } from '~/modules/Auth/Domain/User'

export interface RecoverPasswordApplicationRequest {
  email: User['email']
  sendNewToken: boolean
}
