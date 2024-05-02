export type PostFilterStringTypeOption =
  'postTitle' |
  'producerSlug' |
  'actorId' |
  'tagId' |
  'actorSlug' |
  'tagSlug' |
  'savedBy' |
  'viewedBy'

export const PostFilterStringTypeOptions: PostFilterStringTypeOption[] = [
  'postTitle',
  'producerSlug',
  'actorId',
  'tagId',
  'actorSlug',
  'tagSlug',
  'savedBy',
  'viewedBy',
]

export const GetPostsFilterStringTypeOptions:
  Extract<PostFilterStringTypeOption, 'postTitle' | 'producerSlug' | 'actorSlug' | 'tagSlug'>[] = [
    'postTitle', 'producerSlug', 'actorSlug', 'tagSlug',
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
