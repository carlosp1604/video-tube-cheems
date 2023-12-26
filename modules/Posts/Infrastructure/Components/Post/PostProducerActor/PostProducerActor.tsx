import styles from './PostProducerActor.module.scss'
import { FC, ReactElement } from 'react'
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
        href={ '/' }
        className={ styles.postProducerActor__producerActorItem }
        title={ producer.name }
      >
        <AvatarImage
          imageUrl={ producer.imageUrl }
          avatarClassName={ styles.postProducerActor__producerActorLogo }
          imageClassName={ styles.postProducerActor__producerActorLogo }
          avatarName={ producer.name }
          size={ '40' }
          round={ true }
          imageAlt={ producer.name }
        />
        { producer.name }
      </Link>
    )
  }

  if (actor !== null) {
    actorSection = (
      <Link
        href={ '/' }
        className={ styles.postProducerActor__producerActorItem }
        title={ actor.name }
      >
        <AvatarImage
          imageUrl={ actor.imageUrl }
          avatarClassName={ styles.postProducerActor__producerActorLogo }
          imageClassName={ styles.postProducerActor__producerActorLogo }
          avatarName={ actor.name }
          size={ '40' }
          round={ true }
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
