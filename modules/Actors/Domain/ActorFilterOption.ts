export type ActorFilterStringTypeOption =
  'actorName'

export const GetActorsFilterStringTypeOptions:
  Extract<ActorFilterStringTypeOption, 'actorName'>[] = ['actorName']

export type GetActorsFilterStringTypeOption = typeof GetActorsFilterStringTypeOptions[number]

export interface ActorFilterOptionInterface {
  type: GetActorsFilterStringTypeOption
  value: string
}
