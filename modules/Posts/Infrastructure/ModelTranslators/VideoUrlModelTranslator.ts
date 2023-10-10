import { VideoUrl as PrismaVideoUrlModel } from '@prisma/client'
import { DateTime } from 'luxon'
import { VideoUrl } from '~/modules/Posts/Domain/VideoUrls/VideoUrl'
import { VideoUrlWithVideoProvider } from '~/modules/Posts/Infrastructure/PrismaModels/VideoUrlModel'
import {
  VideoProviderModelTranslator
} from '~/modules/Posts/Infrastructure/ModelTranslators/VideoProviderModelTranslator'
import { Relationship } from '~/modules/Shared/Domain/Relationship/Relationship'

export class VideoUrlModelTranslator {
  public static toDomain (prismaVideoUrlModel: PrismaVideoUrlModel) {
    const videoUrlWithProvider = prismaVideoUrlModel as VideoUrlWithVideoProvider

    const domainVideoProvider = VideoProviderModelTranslator.toDomain(videoUrlWithProvider.provider)

    const domainVideoProviderRelation = Relationship.initializeRelation(domainVideoProvider)

    let deletedAt: DateTime | null = null

    if (prismaVideoUrlModel.deletedAt !== null) {
      deletedAt = DateTime.fromJSDate(prismaVideoUrlModel.deletedAt)
    }

    return new VideoUrl(
      prismaVideoUrlModel.type,
      prismaVideoUrlModel.providerId,
      prismaVideoUrlModel.postId,
      prismaVideoUrlModel.url,
      DateTime.fromJSDate(prismaVideoUrlModel.createdAt),
      DateTime.fromJSDate(prismaVideoUrlModel.updatedAt),
      deletedAt,
      domainVideoProviderRelation
    )
  }
}
