import styles from './PostProducerActor.module.scss'
import { CSSProperties, FC, ReactElement } from 'react'
import Link from 'next/link'
import { BsX } from 'react-icons/bs'
import {
  PostComponentDtoActorDto,
  PostComponentDtoProducerDto
} from '~/modules/Posts/Infrastructure/Dtos/PostComponentDto'
import { AvatarImage } from '~/components/AvatarImage/AvatarImage'

export interface Props {
  producer: PostComponentDtoProducerDto | null
  actor: PostComponentDtoActorDto | null
}

export const PostProducerActor: FC<Props> = ({
  producer,
  actor,
}) => {
  let producerSection: ReactElement | null = null
  let actorSection: ReactElement | null = null

  if (producer !== null) {
    producerSection = (
      <Link
        href={ `/producers/${producer.slug}` }
        className={ styles.postProducerActor__producerActorLink }
        title={ producer.name }
        style={ {
          '--producer-color': producer.brandHexColor,
        } as CSSProperties }
      >
        <AvatarImage
          imageUrl={ producer.imageUrl }
          avatarClassName={ styles.postProducerActor__producerActorAvatar }
          imageClassName={ styles.postProducerActor__producerActorLogo }
          avatarName={ producer.name }
          imageAlt={ producer.name }
          color={ producer.brandHexColor }
        />
        { producer.name }
      </Link>
    )
  }

  if (actor !== null) {
    actorSection = (
      <Link
        href={ `/actors/${actor.slug}` }
        className={ styles.postProducerActor__producerActorLink }
        title={ actor.name }
      >
        <AvatarImage
          imageUrl={ actor.imageUrl }
          avatarClassName={ styles.postProducerActor__producerActorLogo }
          imageClassName={ styles.postProducerActor__producerActorLogo }
          avatarName={ actor.name }
          imageAlt={ actor.name }
        />
        { actor.name }
      </Link>
    )
  }

  return (
    <div className={ styles.postProducerActor__container }>
      { producerSection }
      { producerSection && actorSection
        ? <BsX className={ styles.postProducerActor__producerActorIcon }/>
        : null
      }
      { actorSection }
    </div>
  )
}
