import { DateTime } from 'luxon'
import { VideoProvider } from '~/modules/Posts/Domain/VideoUrls/VideoProvider'
import { Relationship } from '~/modules/Shared/Domain/Relationship/Relationship'
import { VideoUrlDomainException } from '~/modules/Posts/Domain/VideoUrls/VideoUrlDomainException'

export class VideoUrl {
  public readonly type: string
  public readonly providerId: string
  public readonly postId: string
  public readonly url: string
  public readonly createdAt: DateTime
  public readonly updatedAt: DateTime
  public readonly deletedAt: DateTime | null

  /** Relationships **/
  public readonly _provider: Relationship<VideoProvider>

  public constructor (
    type: string,
    providerId: string,
    postId: string,
    url: string,
    createdAt: DateTime,
    updatedAt: DateTime,
    deletedAt: DateTime | null,
    provider: Relationship<VideoProvider> = Relationship.notLoaded()
  ) {
    this.type = type
    this.providerId = providerId
    this.postId = postId
    this.url = url
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.deletedAt = deletedAt
    this._provider = provider
  }

  get provider (): VideoProvider {
    const provider = this._provider.value

    if (provider === null) {
      throw VideoUrlDomainException.cannotGetProvider(this.providerId)
    }

    return provider
  }
}
