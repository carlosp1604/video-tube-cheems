import { FC, useState } from 'react'
import styles from './PostCardGallery.module.scss'
import { PostCardList } from './PostCardList'

export const PostCardGallery: FC = () => {
  const [playerId, setPlayerId] = useState<string>('')

  return (
    <div className={ styles.postCardGallery__container }>
      <PostCardList playerId={playerId} setPlayerId={ setPlayerId } />
    </div>
  )
}