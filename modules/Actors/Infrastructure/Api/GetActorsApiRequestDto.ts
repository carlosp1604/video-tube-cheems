export interface GetActorsApiRequestDto {
  readonly page: number
  readonly perPage: number
  readonly orderBy: string
  readonly order: string
}

export interface UnprocessedGetActorsApiRequestDto {
  readonly page: any
  readonly perPage: any
  readonly orderBy: any
  readonly order: any
}
