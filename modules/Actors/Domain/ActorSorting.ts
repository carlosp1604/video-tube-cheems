export type ActorSortingOption = 'name' | 'posts' | 'views'

export const GetActorsSortingOptions:
  Extract<ActorSortingOption, 'name' | 'posts' | 'views'>[] = ['name', 'posts', 'views']

export type GetActorsSortingOption = typeof GetActorsSortingOptions[number]
