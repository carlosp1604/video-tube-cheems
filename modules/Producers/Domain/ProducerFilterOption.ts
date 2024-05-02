export type ProducerFilterStringTypeOption =
  'producerName'

export const GetProducersFilterStringTypeOptions:
  Extract<ProducerFilterStringTypeOption, 'producerName'>[] = ['producerName']

export type GetProducersFilterStringTypeOption = typeof GetProducersFilterStringTypeOptions[number]

export interface ProducerFilterOptionInterface {
  type: ProducerFilterStringTypeOption
  value: string
}
