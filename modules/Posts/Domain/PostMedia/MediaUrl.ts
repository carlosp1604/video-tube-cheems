import { DateTime } from 'luxon'
import { MediaProvider } from '~/modules/Posts/Domain/PostMedia/MediaProvider'
import { Relationship } from '~/modules/Shared/Domain/Relationship/Relationship'
import { MediaUrlDomainException } from '~/modules/Posts/Domain/PostMedia/MediaUrlDomainException'

export enum MediaUrlType {
  IMAGE = 'Image',
  VIDEO = 'Video',
  EMBED = 'Embed'
}

export class MediaUrl {
  public readonly id: string
  public readonly title: string
  public readonly type: MediaUrlType
  public readonly providerId: string
  public readonly postMediaId: string
  public readonly url: string
  public readonly downloadUrl: string | null
  public readonly thumbnailUrl: string | null
  public readonly createdAt: DateTime
  public readonly updatedAt: DateTime

  /** Relationships **/
  public readonly _provider: Relationship<MediaProvider>

  public constructor (
    id: string,
    title: string,
    type: string,
    providerId: string,
    postMediaId: string,
    url: string,
    downloadUrl: string | null,
    thumbnailUrl: string | null,
    createdAt: DateTime,
    updatedAt: DateTime,
    provider: Relationship<MediaProvider> = Relationship.notLoaded()
  ) {
    this.id = id
    this.title = title
    this.type = MediaUrl.validateMediaUrlType(type)
    this.providerId = providerId
    this.postMediaId = postMediaId
    this.url = url
    this.downloadUrl = downloadUrl
    this.thumbnailUrl = thumbnailUrl
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this._provider = provider
  }

  get provider (): MediaProvider {
    const provider = this._provider.value

    if (provider === null) {
      throw MediaUrlDomainException.cannotGetProvider(this.providerId)
    }

    return provider
  }

  private static validateMediaUrlType (value: string): MediaUrlType {
    const values: string [] = Object.values(MediaUrlType)

    if (!values.includes(value)) {
      throw MediaUrlDomainException.invalidMediaUrlType(value)
    }

    return value as MediaUrlType
  }
}
