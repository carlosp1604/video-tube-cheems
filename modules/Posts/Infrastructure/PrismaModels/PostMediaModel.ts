import { Prisma } from '@prisma/client'

export type MediaUrlWithMediaProvider = Prisma.MediaUrlGetPayload<{
  include: { provider: true }
}>

export type PostMediaWithMediaUrlWithMediaProvider = Prisma.PostMediaGetPayload<{
  include: {
    mediaUrls: {
      include: {
        provider: true
      }
    }
  }
}>
