export interface ActorPageComponentDto {
  readonly id: string
  readonly slug: string
  readonly name: string
  readonly imageUrl: string | null
  readonly description: string | null
  readonly viewsCount: number
}
