export type PostFilterStringTypeOption =
  'postTitle' |
  'producerId' |
  'actorId' |
  'tagId' |
  'producerName' |
  'actorName' |
  'tagName' |
  'savedBy' |
  'viewedBy'

export const GetPostsFilterStringTypeOptions:
  Extract<PostFilterStringTypeOption, 'postTitle' | 'producerId'>[] = [
    'postTitle', 'producerId',
  ]

export type GetPostsFilterStringTypeOption = typeof GetPostsFilterStringTypeOptions[number]

export const GetUserSavedPostsFilterStringTypeOptions: Extract<PostFilterStringTypeOption, 'savedBy'>[] = ['savedBy']

export const GetUserHistoryFilterStringTypeOptions: Extract<PostFilterStringTypeOption, 'viewedBy'>[] = ['viewedBy']

export type GetUserSavedPostsFilterStringTypeOption = typeof GetUserSavedPostsFilterStringTypeOptions[number]
export type GetUserHistoryFilterStringTypeOption = typeof GetUserHistoryFilterStringTypeOptions[number]

export interface PostFilterOptionInterface {
  type: PostFilterStringTypeOption
  value: string
}
