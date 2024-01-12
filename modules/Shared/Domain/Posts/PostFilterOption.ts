export type PostFilterStringTypeOption =
  'postTitle' |
  'producerSlug' |
  'actorId' |
  'tagId' |
  'producerName' |
  'actorSlug' |
  'tagName' |
  'savedBy' |
  'viewedBy'

export const GetPostsFilterStringTypeOptions:
  Extract<PostFilterStringTypeOption, 'postTitle' | 'producerSlug' | 'actorSlug'>[] = [
    'postTitle', 'producerSlug', 'actorSlug',
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
