import styles from './ActorCardSkeleton.module.scss'
import { FC } from 'react'

export const ActorCardSkeleton: FC = () => {
  return (
    <div className={ styles.actorCardSkeleton__container }>
      <div className={ styles.actorCardSkeleton__imageWrapper }>
        <span className={ styles.actorCardSkeleton__actorImage }/>
      </div>
      <div className={ styles.actorCardSkeleton__dataContainer }>
        <span className={ styles.actorCardSkeleton__actorName } />
        <div className={ styles.actorCardSkeleton__countSection }>
          <span className={ styles.actorCardSkeleton__countItem } />
          <span className={ styles.actorCardSkeleton__countItem } />
        </div>
      </div>
    </div>

  )
}
