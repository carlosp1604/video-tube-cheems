export enum RepositoryFilterStringTypeOption {
  POST_TITLE = 'postTitle',
  PRODUCER_ID = 'producerId',
  ACTOR_ID = 'actorId',
  TAG_ID = 'tagId',
  PRODUCER_NAME = 'producerName',
  ACTOR_NAME = 'actorName',
  TAG_NAME = 'tagName',
}

export interface RepositoryFilterOptionInterface {
  type: RepositoryFilterStringTypeOption
  value: string
}
