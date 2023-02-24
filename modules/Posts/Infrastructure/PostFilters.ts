export enum PostFilterOptions {
  postTitle = 'postTitle',
  producerId = 'producerId',
  actorId = 'actorId',
  tagId = 'tagId',
  producerName = 'producerName',
  actorName = 'actorName',
  tagName = 'tagName',
}

export type PostFilterOptionsType = keyof typeof PostFilterOptions