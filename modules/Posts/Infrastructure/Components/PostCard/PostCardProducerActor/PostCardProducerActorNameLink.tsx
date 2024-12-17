import { FC, ReactElement } from 'react'
import styles from './PostCardProducerActor.module.scss'
import Link from 'next/link'
import {
  ActorPostCardComponentDto,
  ProducerPostCardComponentDto
} from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import { usePathname } from 'next/navigation'
import { MdLiveTv } from 'react-icons/md'
import { FaRegStar } from 'react-icons/fa'

interface Props {
  producer: ProducerPostCardComponentDto | null
  actor: ActorPostCardComponentDto | null
}

export const PostCardProducerActorNameLink: FC<Props> = ({
  producer,
  actor,
}) => {
  const pathname = usePathname()

  let producerNameLink: ReactElement | null = null

  if (producer !== null) {
    const producerLink = `/producers/${producer.slug}`

    let linkDisabled = false

    if (pathname === producerLink) {
      linkDisabled = true
    }

    producerNameLink = (
      <Link
        className={ `
          ${styles.postCardProducerActor__producerTitle}
          ${linkDisabled ? styles.postCardProducerActor__producerTitle__disabled : ''}
        ` }
        href={ `/producers/${producer.slug}` }
        title={ producer.name }
      >
        <MdLiveTv className={ styles.postCardProducerActor__producerIcon }/>
        { producer.name }
      </Link>
    )
  }

  if (producer === null && actor !== null) {
    const actorLink = `/actors/${actor.slug}`

    let linkDisabled = false

    if (pathname === actorLink) {
      linkDisabled = true
    }

    producerNameLink = (
      <Link
        className={ `
          ${styles.postCardProducerActor__producerTitle}
          ${linkDisabled ? styles.postCardProducerActor__producerTitle__disabled : ''}
        ` }
        href={ `/actors/${actor.slug}` }
        title={ actor.name }
      >
        <FaRegStar className={ styles.postCardProducerActor__producerIcon }/>
        { actor.name }
      </Link>
    )
  }

  return (
    producerNameLink
  )
}
