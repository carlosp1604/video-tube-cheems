import { FC } from 'react'
import styles from './ProducerActor.module.scss'
import { AvatarImage } from '~/components/AvatarImage/AvatarImage'
import Link from 'next/link'

export type ProducerActorType = 'actor' | 'producer'

export interface Props {
  name: string
  slug: string
  imageUrl: string | null
  type: ProducerActorType
}

export const ProducerActor: FC<Props> = ({ name, slug, imageUrl, type }) => {
  let href = `/producers/${slug}`

  if (type === 'actor') {
    href = `/actors/${slug}`
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
        imageAlt={ name }
      />
      { name }
    </Link>
  )
}
