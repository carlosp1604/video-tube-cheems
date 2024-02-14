import { DateTime } from 'luxon'
import { Collection } from '~/modules/Shared/Domain/Relationship/Collection'
import { View } from '~/modules/Views/Domain/View'
import { ViewableModel } from '~/modules/Views/Domain/ViewableModel'

export class Actor extends ViewableModel {
  public readonly id: string
  public readonly slug: string
  public readonly name: string
  public readonly description: string | null
  public readonly imageUrl: string | null
  public readonly createdAt: DateTime
  public updatedAt: DateTime
  public deletedAt: DateTime | null

  public constructor (
    id: string,
    slug: string,
    name: string,
    description: string | null,
    imageUrl: string | null,
    createdAt: DateTime,
    updatedAt: DateTime,
    deletedAt: DateTime | null,
    views: Collection<View, View['id']> = Collection.notLoaded()
  ) {
    super()
    this.id = id
    this.slug = slug
    this.name = name
    this.description = description
    this.imageUrl = imageUrl
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.deletedAt = deletedAt
    this.modelViews = views
  }
}
