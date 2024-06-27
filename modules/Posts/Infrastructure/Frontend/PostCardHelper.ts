export type Resolutions = 'sd' | 'hd' | 'fhd' | '4k'

export const getResolution = (quality: string): string => {
  if (isNaN(parseInt(quality))) {
    return ''
  }

  const numericQuality = parseInt(quality)

  if (numericQuality < 720) {
    return 'sd'
  }

  if (numericQuality === 720 ||
    (numericQuality > 720 && numericQuality < 1080)) {
    return 'hd'
  }

  if (numericQuality === 1080 ||
    (numericQuality > 1080 && numericQuality < 2160)) {
    return 'fhd'
  }

  return '4k'
}
