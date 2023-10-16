import { DateTime } from 'luxon'
import { MediaUrl } from '~/modules/Posts/Domain/PostMedia/MediaUrl'
import { Collection } from '~/modules/Shared/Domain/Relationship/Collection'
import { PostMediaDomainException } from '~/modules/Posts/Domain/PostMedia/PostMediaDomainException'

export enum PostMediaType {
  IMAGE = 'Image',
  VIDEO = 'Video',
  EMBED = 'Embed'
}

export class PostMedia {
  public readonly id: string
  public readonly type: PostMediaType
  public readonly title: string
  public readonly postId: string
  public readonly thumbnailUrl: string | null
  public readonly createdAt: DateTime
  public updatedAt: DateTime

  /** Relationships **/
  private readonly _mediaUrls: Collection<MediaUrl, MediaUrl['url']>

  public constructor (
    id: string,
    type: string,
    title: string,
    postId: string,
    thumbnailUrl: string | null,
    createdAt: DateTime,
    updatedAt: DateTime,
    mediaUrls: Collection<MediaUrl, MediaUrl['url']> = Collection.notLoaded()
  ) {
    this.id = id
    this.type = PostMedia.validateMediaUrlType(id, type)
    this.title = title
    this.postId = postId
    this.thumbnailUrl = thumbnailUrl
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this._mediaUrls = mediaUrls
  }

  get mediaUrls (): Array<MediaUrl> {
    return this._mediaUrls.values
  }

  private static validateMediaUrlType (id: string, value: string): PostMediaType {
    const values: string [] = Object.values(PostMediaType)

    if (!values.includes(value)) {
      throw PostMediaDomainException.invalidPostMediaType(id, value)
    }

    return value as PostMediaType
  }
}
