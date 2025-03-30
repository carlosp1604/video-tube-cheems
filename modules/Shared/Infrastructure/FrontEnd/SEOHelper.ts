import { Translate } from 'next-translate'

const SEO_TITLE_LENGTH = 60

export class SEOHelper {
  public static buildDescription (
    title: string,
    t: Translate,
    producer: string | null,
    actor: string | null
  ) : string {
    if (producer) {
      return t('post_description_with_producer_title', { title, producer })
    }

    if (actor) {
      return t('post_description_with_producer_title', { title, producer: actor })
    }

    return t('post_description_base_title', { title })
  }

  public static buildTitle (title: string) : string {
    if (title.length <= SEO_TITLE_LENGTH) {
      return title
    }

    const splitTitle = title.split('-')

    if (splitTitle.length === 1 || splitTitle.length === 0) {
      return title
    }

    const actorsFragment = splitTitle.pop()

    const titleToReturn = splitTitle.join('-').trim()

    if (titleToReturn.length >= SEO_TITLE_LENGTH || !actorsFragment) {
      return titleToReturn
    }

    const actors = actorsFragment.split('&')

    const actorsToInclude = []

    for (const actor of actors) {
      actorsToInclude.push(actor)

      const updatedTitle = `${titleToReturn} - ${actorsToInclude.join(' & ')}`

      if (updatedTitle.length > SEO_TITLE_LENGTH) {
        actorsToInclude.pop()

        break
      }
    }

    return `${titleToReturn}${actorsToInclude.length > 0 ? ' - ' + actorsToInclude.join(' & ') : ''}`
  }

  public static buildBannerDescription (
    title: string,
    t: Translate,
    producer: string | null,
    actor: string | null
  ) : string {
    if (producer) {
      return t('post_page_banner_description_with_producer_title', { title, producer })
    }

    if (actor) {
      return t('post_page_banner_description_with_producer_title', { title, producer: actor })
    }

    return t('post_page_banner_description', { title })
  }
}
