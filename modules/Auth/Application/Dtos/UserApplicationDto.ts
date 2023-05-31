export interface UserApplicationDto {
  readonly id: string
  readonly name: string
  readonly email: string
  readonly imageUrl: string | null
  readonly language: string
  readonly emailVerified: string | null
  readonly createdAt: string
  readonly updatedAt: string
}
