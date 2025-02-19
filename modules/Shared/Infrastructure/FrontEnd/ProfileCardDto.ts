export interface ProfileCardDto {
  readonly id: string
  readonly name: string
  readonly imageUrl: string | null
  readonly slug: string
  readonly postsNumber: number
  readonly viewsNumber: number
}
