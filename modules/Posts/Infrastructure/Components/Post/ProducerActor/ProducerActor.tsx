import { FC } from 'react'
import styles from './ProducerActor.module.scss'
import { AvatarImage } from '~/components/AvatarImage/AvatarImage'
import Link from 'next/link'
import useTranslation from 'next-translate/useTranslation'

export type ProducerActorType = 'actor' | 'producer'

export interface Props {
  name: string
  slug: string
  imageUrl: string | null
  type: ProducerActorType
}

export const ProducerActor: FC<Props> = ({ name, slug, imageUrl, type }) => {
  const { t } = useTranslation('common')

  let href = `/producers/${slug}`
  let altTitle = t('producer_image_alt_title', { producerName: name })

  if (type === 'actor') {
    href = `/actors/${slug}`
    altTitle = t('actor_image_alt_title', { actorName: name })
  }

  return (
    <Link
      href={ href }
      className={ styles.producerActor__container }
      title={ name }
    >
      <AvatarImage
        imageUrl={ imageUrl }
        avatarClassName={ styles.producerActor__avatar }
        imageClassName={ styles.producerActor__image }
        avatarName={ name }
        imageAlt={ altTitle }
      />
      { name }
    </Link>
  )
}
