
export class PaginatedPostCardGalleryHelper {
  public static genRandomValue (min: number, max: number, except: Array<number>): number {
    const random = Math.floor(Math.random() * (max - min + 1)) + min

    if (except.includes(random)) {
      return PaginatedPostCardGalleryHelper.genRandomValue(min, max, except)
    }

    return random
  }

  public static getRandomElementFromArray (elements: Array<string>): string {
    const random = Math.floor(Math.random() * ((elements.length - 1) + 1))

    return elements[random]
  }
}
