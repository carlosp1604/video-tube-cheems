import { Prisma } from '@prisma/client'

export type UserWithVerificationToken = Prisma.UserGetPayload<{
  include: {
    verificationToken: true
  }
}>
