export type FilterApplicationOption = 
  'postTitle' |
  'producerId' |
  'actorId' |
  'tagId' |
  'producerName' |
  'actorName' |
  'tagName'


export type ApplicationFilter<T> = {
  type: T,
  value: string
}