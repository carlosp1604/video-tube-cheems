import { FC } from 'react'
import styles from './ReactionButtonSkeleton.module.scss'

export const ReactionButtonSkeleton: FC = () => {
  return (
    <div className={ styles.reactionButtonSkeleton__container }>
      <span className={ styles.reactionButtonSkeleton__iconSkeleton }/>
      <span>0</span>
    </div>
  )
}
