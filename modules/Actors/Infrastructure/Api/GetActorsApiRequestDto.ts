export interface GetActorsApiFilterRequestDto {
  type: string
  value: string
}

export interface GetActorsApiRequestDto {
  readonly page: number
  readonly perPage: number
  readonly orderBy: string
  readonly order: string
  readonly filters: GetActorsApiFilterRequestDto[]
}

export interface UnprocessedGetActorsApiRequestDto {
  readonly page: any
  readonly perPage: any
  readonly orderBy: any
  readonly order: any
  readonly filters: GetActorsApiFilterRequestDto[]
}
