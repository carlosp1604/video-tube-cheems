export const handleClick = (url?: string) => {
  if (window && url) {
    window.open(url, '_blank')
  }
}
