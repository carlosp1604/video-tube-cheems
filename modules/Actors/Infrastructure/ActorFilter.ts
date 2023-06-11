export enum ActorFilterOptions {
  actorId = 'actorId',
  actorName = 'actorName',
}

export type ActorFilterOptionsType = keyof typeof ActorFilterOptions
