import { FC } from 'react'
import styles from './ActorCardList.module.scss'
import { ActorComponentDto } from '../ActorComponentDto'
import { ActorCard } from './ActorCard'

interface Props {
  actors: ActorComponentDto[]
}

export const ActorCardList: FC<Props> = ({ actors }) => {
  return (
    <div className={ styles.actorCardList__container }>
      { actors.map((actor) => {
        return (
          <ActorCard
            actor={actor}
            key={actor.id}
          />
        )
      })}
    </div>
  )
}