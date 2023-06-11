import { FC } from 'react'
import styles from './ActorCardList.module.scss'
import { ActorCard } from './ActorCard'
import { ActorComponentDto } from '~/modules/Actors/Infrastructure/ActorComponentDto'

interface Props {
  actors: ActorComponentDto[]
}

export const ActorCardList: FC<Props> = ({ actors }) => {
  return (
    <div className={ styles.actorCardList__container }>
      { actors.map((actor) => {
        return (
          <ActorCard
            actor={ actor }
            key={ actor.id }
          />
        )
      }) }
    </div>
  )
}
