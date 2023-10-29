export type PostFilterStringTypeOption =
  'postTitle' |
  'producerId' |
  'actorId' |
  'tagId' |
  'producerName' |
  'actorName' |
  'tagName' |
  'savedBy'

export const GetPostsFilterStringTypeOptions:
  Extract<PostFilterStringTypeOption, 'postTitle' | 'producerId'>[] = [
    'postTitle', 'producerId',
  ]

export type GetPostsFilterStringTypeOption = typeof GetPostsFilterStringTypeOptions[number]

export const GetUserSavedPostsFilterStringTypeOptions: Extract<PostFilterStringTypeOption, 'savedBy'>[] = ['savedBy']

export type GetUserSavedPostsFilterStringTypeOption = typeof GetUserSavedPostsFilterStringTypeOptions[number]

export interface PostFilterOptionInterface {
  type: PostFilterStringTypeOption
  value: string
}
