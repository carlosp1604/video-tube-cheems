import { Prisma } from '@prisma/client'

export type PostWithActors = Prisma.PostGetPayload<{
  include: {
    actors: {
      include: {
        actor: true
      }
    }
  }
}>

export type PostWithTags = Prisma.PostGetPayload<{
  include: {
    tags: {
      include: {
        tag: true
      }
    }
  }
}>

export type PostWithMeta = Prisma.PostGetPayload<{
  include: { meta: true }
}>

export type PostWithComments = Prisma.PostGetPayload<{
  include: {
    comments: {
      include: {
        childComments: true
        user: true
      }
    }
  }
}>

export type PostWithReactions = Prisma.PostGetPayload<{
  include: { reactions: true }
}>

export type PostWithProducer = Prisma.PostGetPayload<{
  include: { producer: true }
}>

export type PostWithProducerWithParent = Prisma.PostGetPayload<{
  include: { producer: { include: { parentProducer: true }} }
}>

export type PostWithActor = Prisma.PostGetPayload<{
  include: { actor: true }
}>

export type PostWithTranslations = Prisma.PostGetPayload<{
  include: { translations: true }
}>
