import { DateTime } from 'luxon'
import { Relationship } from '~/modules/Shared/Domain/Relationship/Relationship'
import { ViewableModel } from '~/modules/Views/Domain/ViewableModel'
import { Collection } from '~/modules/Shared/Domain/Relationship/Collection'
import { View } from '~/modules/Views/Domain/View'

export class Producer extends ViewableModel {
  public readonly id: string
  public readonly slug: string
  public readonly name: string
  public readonly description: string | null
  public readonly imageUrl: string | null
  public readonly parentProducerId: string | null
  public readonly createdAt: DateTime
  public readonly brandHexColor: string
  public updatedAt: DateTime
  public deletedAt: DateTime | null

  /** Relationships **/
  // eslint-disable-next-line no-use-before-define
  private _parentProducer: Relationship<Producer | null>

  public constructor (
    id: string,
    slug: string,
    name: string,
    description: string | null,
    imageUrl: string | null,
    parentProducerId: string | null,
    brandHexColor: string,
    createdAt: DateTime,
    updatedAt: DateTime,
    deletedAt: DateTime | null,
    parentProducer: Relationship<Producer | null> = Relationship.notLoaded(),
    views: Collection<View, View['id']> = Collection.notLoaded()
  ) {
    super()
    this.id = id
    this.slug = slug
    this.name = name
    this.description = description
    this.imageUrl = imageUrl
    this.parentProducerId = parentProducerId
    this.brandHexColor = brandHexColor
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.deletedAt = deletedAt
    this._parentProducer = parentProducer
    this.modelViews = views
  }

  get parentProducer (): Producer | null {
    return this._parentProducer.value
  }
}
