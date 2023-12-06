export type PostSortingOption = 'date' | 'views' | 'saved-date' | 'view-date'

export const GetPostsSortingOptions:
  Extract<PostSortingOption, 'date' | 'views'>[] = ['date', 'views']

export const GetUserSavedPostsSortingOptions:
  Extract<PostSortingOption, 'date' | 'views' | 'saved-date'>[] = ['date', 'views', 'saved-date']

export const GetUserHistorySortingOptions:
  Extract<PostSortingOption, 'date' | 'views' | 'view-date'>[] = ['date', 'views', 'view-date']

export type GetPostsSortingOption = typeof GetPostsSortingOptions[number]
export type GetUserSavedPostsSortingOption = typeof GetUserSavedPostsSortingOptions[number]
export type GetUserHistorySortingOption = typeof GetUserHistorySortingOptions[number]
