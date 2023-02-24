export type RepositoryFilterOption = 
  'postTitle' |
  'producerId' |
  'actorId' |
  'tagId' |
  'producerName' |
  'actorName' |
  'tagName'

export type RepositoryFilter<T> = {
  type: T,
  value: string
}