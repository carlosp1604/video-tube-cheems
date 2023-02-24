import { NextPage } from 'next'
import Link from 'next/link'
import { ActorComponentDto } from '../ActorComponentDto'
import styles from './ActorCard.module.scss'

export interface Props {
  actor: ActorComponentDto
}

export const ActorCard: NextPage<Props> = ({ actor }) => {
  return (
    <Link
      href={`/actors/${actor.id}`}
     className={ styles.actorCard__container}>
      <div className={styles.actorCard__imageWrapper}
      >
        <img 
          className={styles.actorCard__actorImage}
          src={actor.imageUrl}
          alt={actor.name}
        />
      </div>


      <h1 className={ styles.actorCard__actorName }>
        { actor.name }
      </h1>
    </Link>
  )
}