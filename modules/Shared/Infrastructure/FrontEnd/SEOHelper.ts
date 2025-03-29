import { Translate } from 'next-translate'

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
    const splitTitle = title.split('-')

    if (splitTitle.length === 1) {
      return title
    }

    splitTitle.pop()

    return splitTitle.join('-').trim()
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
