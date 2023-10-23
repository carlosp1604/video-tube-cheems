export type PostFilterStringTypeOption =
  'postTitle' |
  'producerId' |
  'actorId' |
  'tagId' |
  'producerName' |
  'actorName' |
  'tagName'

export const GetPostsFilterStringTypeOptions:
  Extract<PostFilterStringTypeOption, 'postTitle' | 'producerId'>[] = [
    'postTitle', 'producerId',
  ]

export type GetPostsFilterStringTypeOption = typeof GetPostsFilterStringTypeOptions[number]

export interface RepositoryFilterOptionInterface {
  type: PostFilterStringTypeOption
  value: string
}
