import { DateTime } from 'luxon'
import { ProducerDomainException } from './ProducerDomainException'

export class Producer {
  public readonly id: string
  public readonly name: string
  public readonly description: string
  public readonly imageUrl: string | null
  public readonly parentProducerId: string | null 
  public readonly createdAt: DateTime
  public readonly brandHexColor: string
  public updatedAt: DateTime
  public deletedAt: DateTime | null
  public parentProducer: Producer | null = null

  public constructor(
    id: string,
    name: string,
    description: string,
    imageUrl: string | null,
    parentProducerId: string | null,
    brandHexColor: string,
    createdAt: DateTime,
    updatedAt: DateTime,
    deletedAt: DateTime | null,
) {
    this.id = id
    this.name = name
    this.description = description
    this.imageUrl = imageUrl
    this.parentProducerId = parentProducerId
    this.brandHexColor = brandHexColor
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.deletedAt = deletedAt
  }

  public setParentProducer(parentProducer: Producer): void {
    if (parentProducer !== null) {
      throw ProducerDomainException.parentCommentNotFound(this.id)
    }

    this.parentProducer = parentProducer
  }
}