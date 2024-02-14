import Link from 'next/link'
import styles from './ProducerCard.module.scss'
import { AvatarImage } from '~/components/AvatarImage/AvatarImage'
import { CSSProperties, FC } from 'react'
import { ProducerCardDto } from '~/modules/Producers/Infrastructure/ProducerCardDto'
import { useTranslation } from 'next-i18next'
import { NumberFormatter } from '~/modules/Shared/Infrastructure/FrontEnd/NumberFormatter'
import { useRouter } from 'next/router'

export interface Props {
  producer: ProducerCardDto
}

export const ProducerCard: FC<Props> = ({ producer }) => {
  const { t } = useTranslation('producers')

  const locale = useRouter().locale ?? 'en'

  return (
    <div
      className={ styles.producerCard__container }
      style={ {
        '--producer-color': producer.brandHexColor,
      } as CSSProperties }
    >
      <div className={ styles.producerCard__imageWrapper }>
        <Link href={ `/producers/${producer.slug}` }>
          <AvatarImage
            imageUrl={ producer.imageUrl }
            avatarClassName={ styles.producerCard__producerAvatar }
            imageClassName={ styles.producerCard__producerImage }
            avatarName={ producer.name }
            imageAlt={ t('producer_card_image_alt_title', { producerName: producer.name }) }
            rounded={ false }
            color={ producer.brandHexColor }
          />
        </Link>
      </div>
      <div className={ styles.producerCard__dataContainer }>
        <Link
          className={ styles.producerCard__producerName }
          href={ `/producers/${producer.slug}` }
        >
          { producer.name }
        </Link>
        <div className={ styles.producerCard__countSection }>
          { t('producer_card_posts_count_title', { postsNumber: producer.postsNumber }) }
          <span className={ styles.producerCard__viewsTitle }>
            { t('producer_card_views_count_title',
              { viewsNumber: NumberFormatter.compatFormat(producer.producerViews, locale) }) }
          </span>
        </div>
      </div>
    </div>
  )
}
