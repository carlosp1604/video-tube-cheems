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

export interface UserPostRawModel {
  post_id: string
  post_title: string
  post_type: string
  post_description: string
  post_slug: string
  post_created_at: Date
  post_updated_at: Date
  post_deleted_at: Date | null
  post_published_at: Date | null
  post_producer_id: string | null
  post_actor_id: string | null
}

export type UserWithRelationsRawModel =
  UserRawModel &
  (UserVerificationTokenRawModel | undefined) &
  (UserPostRawModel | undefined)
