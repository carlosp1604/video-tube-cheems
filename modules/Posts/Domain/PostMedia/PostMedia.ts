import { DateTime } from 'luxon'
import { MediaUrl } from '~/modules/Posts/Domain/PostMedia/MediaUrl'
import { Collection } from '~/modules/Shared/Domain/Relationship/Collection'

export class PostMedia {
  public readonly id: string
  public readonly postId: string
  public readonly createdAt: DateTime
  public updatedAt: DateTime

  /** Relationships **/
  private readonly _mediaUrls: Collection<MediaUrl, MediaUrl['id']>

  public constructor (
    id: string,
    postId: string,
    createdAt: DateTime,
    updatedAt: DateTime,
    mediaUrls: Collection<MediaUrl, MediaUrl['id']> = Collection.notLoaded()
  ) {
    this.id = id
    this.postId = postId
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this._mediaUrls = mediaUrls
  }

  get mediaUrls (): Array<MediaUrl> {
    return this._mediaUrls.values
  }
}
