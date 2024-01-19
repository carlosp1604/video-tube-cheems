import styles from './ActorCardSkeleton.module.scss'
import { FC } from 'react'

export const ActorCardSkeleton: FC = () => {
  return (
    <div className={ styles.actorCardSkeleton__container }>
      <div className={ styles.actorCardSkeleton__imageWrapper }/>
      <div className={ styles.actorCardSkeleton__dataContainer }>
        <span className={ styles.actorCardSkeleton__actorName } />
        <span className={ styles.actorCardSkeleton__postsNumber } />
      </div>
    </div>

  )
}
