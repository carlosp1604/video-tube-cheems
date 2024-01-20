export type ActorSortingOption = 'name' | 'posts'

export const GetActorsSortingOptions:
  Extract<ActorSortingOption, 'name' | 'posts'>[] = ['name', 'posts']

export type GetActorsSortingOption = typeof GetActorsSortingOptions[number]
