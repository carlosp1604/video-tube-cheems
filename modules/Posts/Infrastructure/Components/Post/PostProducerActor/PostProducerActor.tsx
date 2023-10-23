import styles from './PostProducerActor.module.scss'
import { FC, ReactElement } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Avatar from 'react-avatar'
import { BsX } from 'react-icons/bs'
import {
  PostComponentDtoActorDto,
  PostComponentDtoProducerDto
} from '~/modules/Posts/Infrastructure/Dtos/PostComponentDto'

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
    let producerAvatarSection: ReactElement

    if (producer.imageUrl !== null) {
      producerAvatarSection = (
        <Image
          alt={ producer.name }
          className={ styles.postProducerActor__producerActorLogo }
          src={ producer.imageUrl }
          width={ 0 }
          height={ 0 }
          sizes={ '100vw' }
        />
      )
    } else {
      producerAvatarSection = (
        <Avatar
          round={ true }
          size={ '40' }
          name={ producer.name }
        />
      )
    }
    producerSection = (
      <Link
        href={ '/' }
        className={ styles.postProducerActor__producerActorItem }
        title={ producer.name }
      >
        { producerAvatarSection }
        { producer.name }
      </Link>
    )
  }

  if (actor !== null) {
    let actorAvatarSection: ReactElement

    if (actor.imageUrl !== null) {
      actorAvatarSection = (
        <Image
          alt={ actor.name }
          className={ styles.postProducerActor__producerActorLogo }
          src={ actor.imageUrl }
          width={ 0 }
          height={ 0 }
          sizes={ '100vw' }
        />
      )
    } else {
      actorAvatarSection = (
        <Avatar
          round={ true }
          size={ '40' }
          name={ actor.name }
        />
      )
    }
    actorSection = (
      <Link
        href={ '/' }
        className={ styles.postProducerActor__producerActorItem }
        title={ actor.name }
      >
        { actorAvatarSection }
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
