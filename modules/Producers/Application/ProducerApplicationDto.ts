export interface ProducerApplicationDto {
  readonly id: string
  readonly slug: string
  readonly name: string
  readonly description: string
  readonly imageUrl: string | null
  readonly parentProducerId: string | null
  readonly brandHexColor: string
  readonly createdAt: string
  readonly parentProducer: ProducerApplicationDto | null
}
