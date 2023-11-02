import { FC } from 'react'
import styles from './VideoLoadingState.module.scss'
import { AiOutlineLoading } from 'react-icons/ai'

export const VideoLoadingState: FC = () => {
  return (
    <div className={ styles.videoLoadingState__container }>
      <AiOutlineLoading className={ styles.videoLoadingState__loadingIcon }/>
    </div>
  )
}
