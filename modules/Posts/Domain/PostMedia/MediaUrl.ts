import { DateTime } from 'luxon'
import { MediaProvider } from '~/modules/Posts/Domain/PostMedia/MediaProvider'
import { Relationship } from '~/modules/Shared/Domain/Relationship/Relationship'
import { MediaUrlDomainException } from '~/modules/Posts/Domain/PostMedia/MediaUrlDomainException'

export class MediaUrl {
  public readonly providerId: string
  public readonly postMediaId: string
  public readonly title: string
  public readonly url: string
  public readonly downloadUrl: string | null
  public readonly createdAt: DateTime
  public readonly updatedAt: DateTime

  /** Relationships **/
  public readonly _provider: Relationship<MediaProvider>

  public constructor (
    title: string,
    providerId: string,
    postMediaId: string,
    url: string,
    downloadUrl: string | null,
    createdAt: DateTime,
    updatedAt: DateTime,
    provider: Relationship<MediaProvider> = Relationship.notLoaded()
  ) {
    this.title = title
    this.providerId = providerId
    this.postMediaId = postMediaId
    this.url = url
    this.downloadUrl = downloadUrl
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
}
