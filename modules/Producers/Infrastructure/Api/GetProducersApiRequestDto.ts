export interface GetProducersApiFilterRequestDto {
  type: string
  value: string
}

export interface GetProducersApiRequestDto {
  readonly page: number
  readonly perPage: number
  readonly orderBy: string
  readonly order: string
  readonly filters: GetProducersApiFilterRequestDto[]
}

export interface UnprocessedGetProducersApiRequestDto {
  readonly page: any
  readonly perPage: any
  readonly orderBy: any
  readonly order: any
  readonly filters: GetProducersApiFilterRequestDto[]
}
