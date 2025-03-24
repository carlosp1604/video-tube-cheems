import { FC } from 'react'
import styles from './PostCardSkeleton.module.scss'

interface Props {
  loading: boolean
}

export interface PostCardSkeletonOptionalProps {
  showExtraData: boolean
  showData: boolean
}

export const PostCardSkeleton: FC<Partial<Props> & Partial<PostCardSkeletonOptionalProps>> = ({
  loading = false,
  showData = true,
  showExtraData = true,
}) => {
  const postSkeletonExtraDataSection = (
    <div className={ styles.postCardSkeleton__postExtraDataSkeleton }>
      <span className={ styles.postCardSkeleton__postExtraItemSkeleton }/>
      <span className={ styles.postCardSkeleton__postExtraDataSeparator }>•</span>
      <span className={ styles.postCardSkeleton__postExtraItemSkeleton }/>
    </div>
  )
  const postSkeletonDataSection = (
    <div className={ styles.postCardSkeleton__postData }>
      <span className={ styles.postCardSkeleton__producerTitleSkeleton }/>
      <span className={ styles.postCardSkeleton__postTitleSkeleton }/>
      { showExtraData && postSkeletonExtraDataSection }
    </div>
  )

  return (
    <div className={ `
      ${styles.postCardSkeleton__container}
      ${loading ? styles.postCardSkeleton__container__loadingState : ''}  
    ` }>
      <div className={ styles.postCardSkeleton__mediaSkeleton }/>
      { showData && postSkeletonDataSection }
    </div>
  )
}
