import Link from 'next/link'
import styles from './ProducerCard.module.scss'
import { AvatarImage } from '~/components/AvatarImage/AvatarImage'
import { CSSProperties, FC } from 'react'
import { ProducerCardDto } from '~/modules/Producers/Infrastructure/ProducerCardDto'

export interface Props {
  producer: ProducerCardDto
}

export const ProducerCard: FC<Props> = ({ producer }) => {
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
            imageAlt={ 'alto' }
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
        <span className={ styles.producerCard__postsNumber }>
          { `${producer.postsNumber} posts` }
        </span>
      </div>
    </div>

  )
}
