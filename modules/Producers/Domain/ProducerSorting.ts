export type ProducerSortingOption = 'name' | 'posts'

export const GetProducersSortingOptions:
  Extract<ProducerSortingOption, 'name' | 'posts'>[] = ['name', 'posts']

export type GetProducersSortingOption = typeof GetProducersSortingOptions[number]
