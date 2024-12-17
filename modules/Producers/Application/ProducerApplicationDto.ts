export interface ProducerApplicationDto {
  readonly id: string
  readonly slug: string
  readonly name: string
  readonly description: string | null
  readonly imageUrl: string | null
  readonly parentProducerId: string | null
  readonly brandHexColor: string
  readonly createdAt: string
  readonly parentProducer: ProducerApplicationDto | null
  readonly viewsNumber: number
}
