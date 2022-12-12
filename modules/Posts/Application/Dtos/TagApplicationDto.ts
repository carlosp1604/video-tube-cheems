export interface TagApplicationDto {
  readonly id: string
  readonly name: string
  readonly description: string | null
  readonly imageUrl: string | null
}