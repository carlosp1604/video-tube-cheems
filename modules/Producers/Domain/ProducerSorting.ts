export type ProducerSortingOption = 'name' | 'posts' | 'views'

export const GetProducersSortingOptions:
  Extract<ProducerSortingOption, 'name' | 'posts' | 'views'>[] = ['name', 'posts', 'views']

export type GetProducersSortingOption = typeof GetProducersSortingOptions[number]
