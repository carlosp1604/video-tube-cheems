import { Prisma } from '@prisma/client'

export type PostTagWithTranslations = Prisma.PostTagGetPayload<{
  include: { translations: true }
}>
