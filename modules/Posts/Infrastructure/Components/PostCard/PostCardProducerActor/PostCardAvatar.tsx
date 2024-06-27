import { FC, ReactElement } from 'react'
import styles from './PostCardProducerActor.module.scss'
import Link from 'next/link'
import {
  ActorPostCardComponentDto,
  ProducerPostCardComponentDto
} from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import { AvatarImage } from '~/components/AvatarImage/AvatarImage'
import { usePathname } from 'next/navigation'

interface Props {
  producer: ProducerPostCardComponentDto | null
  actor: ActorPostCardComponentDto | null
}

export const PostCardAvatar: FC<Props> = ({
  producer,
  actor,
}) => {
  const pathname = usePathname()

  let producerImage: ReactElement | null = null

  if (producer !== null) {
    const producerLink = `/producers/${producer.slug}`

    let linkDisabled = false

    if (pathname === producerLink) {
      linkDisabled = true
    }

    producerImage = (
      <Link
        className={ `
        ${styles.postCardProducerActor__producerActorAvatarLink}
        ${linkDisabled ? styles.postCardProducerActor__producerActorAvatarLink__disabled : ''}
      ` }
        href={ `/producers/${producer.slug}` }
        title={ producer.name }
      >
        <AvatarImage
          imageUrl={ producer.imageUrl }
          imageClassName={ styles.postCardProducerActor__producerActorLogo }
          avatarName={ producer.name }
          imageAlt={ producer.name }
          avatarClassName={ styles.postCardProducerActor__producerActorAvatarContainer }
          color={ producer.brandHexColor }
          priority={ false }
        />
      </Link>
    )
  }

  if (producer === null && actor !== null) {
    const actorLink = `/actors/${actor.slug}`

    let linkDisabled = false

    if (pathname === actorLink) {
      linkDisabled = true
    }

    producerImage = (
      <Link
        className={ `
        ${styles.postCardProducerActor__producerActorAvatarLink}
        ${linkDisabled ? styles.postCardProducerActor__producerActorAvatarLink__disabled : ''}
      ` }
        href={ `/actors/${actor.slug}` }
        title={ actor.name }
      >
        <AvatarImage
          imageUrl={ actor.imageUrl }
          imageClassName={ styles.postCardProducerActor__producerActorLogo }
          avatarName={ actor.name }
          imageAlt={ actor.name }
          avatarClassName={ styles.postCardProducerActor__producerActorAvatarContainer }
        />
      </Link>
    )
  }

  return (
    producerImage
  )
}
