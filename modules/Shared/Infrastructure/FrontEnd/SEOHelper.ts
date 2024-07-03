import { Translate } from 'next-translate'

export class SEOHelper {
  public static buildDescription (
    title: string,
    t: Translate,
    producer: string | null,
    actor: string | null,
    resolution: string
  ) : string {
    if (producer) {
      if (resolution) {
        return t('post_description_with_producer_with_resolution_title', { title, producer, resolution })
      } else {
        return t('post_description_with_producer_title', { title, producer })
      }
    }

    if (actor) {
      if (resolution) {
        return t('post_description_with_producer_with_resolution_title', { title, producer: actor, resolution })
      } else {
        return t('post_description_with_producer_title', { title, producer: actor })
      }
    }

    if (resolution) {
      return t('post_description_base_title_with_resolution', { title, resolution })
    }

    return t('post_description_base_title', { title })
  }
}
