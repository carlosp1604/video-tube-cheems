import { Prisma } from '@prisma/client'

export type UserWithVerificationToken = Prisma.UserGetPayload<{
  include: {
    verificationToken: true
  }
}>

export type UserWithSavedPosts = Prisma.UserGetPayload<{
  include: {
    savedPosts: {
      include: {
        post: true
      }
    }
  }
}>
