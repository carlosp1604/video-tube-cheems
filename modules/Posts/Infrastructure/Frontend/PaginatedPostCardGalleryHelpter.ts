import { FetchFilter } from '~/modules/Shared/Infrastructure/FrontEnd/FetchFilter'
import { PostFilterOptions } from '~/modules/Posts/Infrastructure/Frontend/PostFilterOptions'

export class PaginatedPostCardGalleryHelper {
  public static arraysEqual (
    currentFiltersArray: FetchFilter<PostFilterOptions>[],
    newFiltersArray: FetchFilter<PostFilterOptions>[]) {
    if (currentFiltersArray.length !== newFiltersArray.length) {
      return false
    }

    for (const currentFilterArray of currentFiltersArray) {
      const foundOnNewArray = newFiltersArray.find((newFilter) =>
        newFilter.type === currentFilterArray.type && newFilter.value === currentFilterArray.value
      )

      if (!foundOnNewArray) {
        return false
      }

      const index = newFiltersArray.indexOf(foundOnNewArray)

      newFiltersArray.splice(index, 1)
    }

    return true
  }

  public static genRandomValue (min: number, max: number, except: Array<number>): number {
    const random = Math.floor(Math.random() * (max - min + 1)) + min

    if (except.includes(random)) {
      return PaginatedPostCardGalleryHelper.genRandomValue(min, max, except)
    }

    return random
  }

  public static getRandomElementFromArray (elements: Array<string>): string {
    const random = Math.floor(Math.random() * ((elements.length - 1) - 0 + 1)) + 0

    return elements[random]
  }
}
