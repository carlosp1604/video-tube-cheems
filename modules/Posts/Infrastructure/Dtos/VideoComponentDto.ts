export interface VideoQualityDto {
  readonly value: string
  readonly title: string
}

export interface VideoComponentDto {
  readonly poster: string
  readonly qualities: VideoQualityDto[]
  readonly download: string | null
}
