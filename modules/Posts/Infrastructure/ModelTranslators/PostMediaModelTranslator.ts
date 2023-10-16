import { PostMedia as PrismaPostMediaModel } from '@prisma/client'
import { DateTime } from 'luxon'
import { PostMedia } from '~/modules/Posts/Domain/PostMedia/PostMedia'
import {
  PostMediaWithMediaUrlWithMediaProvider
} from '~/modules/Posts/Infrastructure/PrismaModels/PostMediaModel'
import { MediaUrlModelTranslator } from '~/modules/Posts/Infrastructure/ModelTranslators/MediaUrlModelTranslator'
import { Collection } from '~/modules/Shared/Domain/Relationship/Collection'
import { MediaUrl } from '~/modules/Posts/Domain/PostMedia/MediaUrl'

export class PostMediaModelTranslator {
  public static toDomain (prismaPostMediaModel: PrismaPostMediaModel): PostMedia {
    const postMediaWithMediaUrlWithProvider = prismaPostMediaModel as PostMediaWithMediaUrlWithMediaProvider

    const mediaUrlsCollection: Collection<MediaUrl, MediaUrl['id']> = Collection.initializeCollection()

    postMediaWithMediaUrlWithProvider.mediaUrls.forEach((mediaUrl) => {
      const domainMediaUrl = MediaUrlModelTranslator.toDomain(mediaUrl)

      mediaUrlsCollection.addItemFromPersistenceLayer(domainMediaUrl, domainMediaUrl.id)
    })

    return new PostMedia(
      prismaPostMediaModel.id,
      prismaPostMediaModel.postId,
      DateTime.fromJSDate(prismaPostMediaModel.createdAt),
      DateTime.fromJSDate(prismaPostMediaModel.updatedAt),
      mediaUrlsCollection
    )
  }
}
