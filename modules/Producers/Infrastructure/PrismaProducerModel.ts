import { Prisma } from '@prisma/client'

export type ProducerWithParent = Prisma.ProducerGetPayload<{
  include: { 
    parentProducer: true,
  }
}>