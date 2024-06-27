export interface ChangeUserPasswordApplicationRequest {
  readonly email: string
  readonly password: string
  readonly token: string
}
