export interface GetProducersApiRequestDto {
  readonly page: number
  readonly perPage: number
  readonly orderBy: string
  readonly order: string
}

export interface UnprocessedGetProducersApiRequestDto {
  readonly page: any
  readonly perPage: any
  readonly orderBy: any
  readonly order: any
}
