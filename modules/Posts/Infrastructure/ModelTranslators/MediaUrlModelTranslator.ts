import { MediaUrl as PrismaMediaUrlModel } from '@prisma/client'
import { DateTime } from 'luxon'
import { MediaUrl } from '~/modules/Posts/Domain/PostMedia/MediaUrl'
import { MediaUrlWithMediaProvider } from '~/modules/Posts/Infrastructure/PrismaModels/PostMediaModel'
import {
  MediaProviderModelTranslator
} from '~/modules/Posts/Infrastructure/ModelTranslators/MediaProviderModelTranslator'
import { Relationship } from '~/modules/Shared/Domain/Relationship/Relationship'

export class MediaUrlModelTranslator {
  public static toDomain (prismaMediaUrlModel: PrismaMediaUrlModel) {
    const mediaUrlWithProvider = prismaMediaUrlModel as MediaUrlWithMediaProvider

    const domainMediaProvider = MediaProviderModelTranslator.toDomain(mediaUrlWithProvider.provider)

    const domainMediaProviderRelation = Relationship.initializeRelation(domainMediaProvider)

    return new MediaUrl(
      prismaMediaUrlModel.title,
      prismaMediaUrlModel.mediaProviderId,
      prismaMediaUrlModel.postMediaId,
      prismaMediaUrlModel.url,
      prismaMediaUrlModel.type,
      DateTime.fromJSDate(prismaMediaUrlModel.createdAt),
      DateTime.fromJSDate(prismaMediaUrlModel.updatedAt),
      domainMediaProviderRelation
    )
  }

  public static toDatabase (mediaUrl: MediaUrl): PrismaMediaUrlModel {
    return {
      url: mediaUrl.url,
      title: mediaUrl.title,
      createdAt: mediaUrl.createdAt.toJSDate(),
      type: mediaUrl.type,
      postMediaId: mediaUrl.postMediaId,
      updatedAt: mediaUrl.updatedAt.toJSDate(),
      mediaProviderId: mediaUrl.providerId,
    }
  }
}
