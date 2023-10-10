import { VideoProvider as PrismaVideoProviderModel } from '@prisma/client'
import { DateTime } from 'luxon'
import { VideoProvider } from '~/modules/Posts/Domain/VideoUrls/VideoProvider'

export class VideoProviderModelTranslator {
  public static toDomain (prismaVideoProviderModel: PrismaVideoProviderModel) {
    return new VideoProvider(
      prismaVideoProviderModel.id,
      prismaVideoProviderModel.name,
      prismaVideoProviderModel.logoUrl,
      DateTime.fromJSDate(prismaVideoProviderModel.createdAt),
      DateTime.fromJSDate(prismaVideoProviderModel.updatedAt)
    )
  }
}
