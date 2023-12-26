import { FC } from 'react'
import styles from './PostCommentCardSkeleton.module.scss'
import { BsDot, BsThreeDotsVertical } from 'react-icons/bs'

export const PostCommentCardSkeleton: FC = () => {
  return (
    <div className={ styles.postCommentCardSkeleton__container }>
      <span className={ styles.postCommentCardSkeleton__userLogo } />
      <div className={ styles.postCommentCardSkeleton__userNameDate }>
        <span className={ styles.postCommentCardSkeleton__userName } />
        <BsDot className={ styles.postCommentCardSkeleton__separatorIcon }/>
        <span className={ styles.postCommentCardSkeleton__commentDate } />
      </div>
      <span className={ styles.postCommentCardSkeleton__comment } />
      <div className={ styles.postCommentCardSkeleton__interactionSkeleton }>
        <span className={ styles.postCommentCardSkeleton__responseButtonSkeleton } />
        <span className={ styles.postCommentCardSkeleton__likeButtonSkeleton } />
      </div>
      <BsThreeDotsVertical className={ styles.postCommentCardSkeleton__optionsSkeleton } />
    </div>
  )
}
