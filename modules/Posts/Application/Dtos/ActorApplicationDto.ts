export interface ActorApplicationDto {
  readonly id: string
  readonly name: string
  readonly description: string | null
  readonly imageUrl: string | null
  readonly viewsCount: number
  readonly createdAt: string
}