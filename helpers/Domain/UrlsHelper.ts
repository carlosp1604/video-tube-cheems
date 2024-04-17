export class UrlsHelper {
  public static deleteTrailingSlash (url: string) {
    if (url.endsWith('/')) {
      return url.slice(0, -1)
    }

    return url
  }
}
