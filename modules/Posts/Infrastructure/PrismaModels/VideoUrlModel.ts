import { Prisma } from '@prisma/client'

export type VideoUrlWithVideoProvider = Prisma.VideoUrlGetPayload<{
  include: { provider: true }
}>
