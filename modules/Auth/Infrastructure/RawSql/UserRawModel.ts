export interface UserRawModel {
  id: string
  name: string
  username: string
  email: string
  image_url: string | null
  language: string
  password: string
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
  email_verified: Date | null
}

export interface UserVerificationTokenRawModel {
  verification_token_id: string
  verification_token_token: string
  verification_token_user_email: string
  verification_token_type: string
  verification_token_expires_at: Date
  verification_token_created_at: Date
}

export type UserWithVerificationTokenRawModel =
  UserRawModel &
  (UserVerificationTokenRawModel | undefined)
