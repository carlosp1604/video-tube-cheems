import { FC } from 'react'
import styles from './PostCardSkeleton.module.scss'
import { BsDot } from 'react-icons/bs'

interface Props {
  loading: boolean
}

export const PostCardSkeleton: FC<Partial<Props>> = ({ loading = false }) => {
  return (
    <div className={ `
      ${styles.postCardSkeleton__container}
      ${loading ? styles.postCardSkeleton__container__loadingState : ''}  
    ` }>
      <div className={ styles.postCardSkeleton__mediaSkeleton }/>
      <div className={ styles.postCardSkeleton__postData }>
        <span className={ styles.postCardSkeleton__postTitleSkeleton }/>
        <span className={ styles.postCardSkeleton__producerTitleSkeleton }/>
        <div className={ styles.postCardSkeleton__postExtraDataSkeleton }>
          <span className={ styles.postCardSkeleton__postExtraItemSkeleton }/>
          <BsDot className={ styles.postCardSkeleton__postExtraDataSeparator }/>
          <span className={ styles.postCardSkeleton__postExtraItemSkeleton }/>
        </div>
      </div>
    </div>
  )
}
