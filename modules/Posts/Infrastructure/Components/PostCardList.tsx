import { Dispatch, FC, SetStateAction } from 'react'
import styles from './PostCardList.module.scss'
import { PostCard } from './PostCard'

interface Props {
  playerId: string
  setPlayerId: Dispatch<SetStateAction<string>>
}

export const PostCardList: FC<Props> = ({ playerId, setPlayerId }) => {
  return (
    <div className={ styles.postCardList__container }>
      <PostCard setPlayerId={ setPlayerId} playerId={ playerId } id={ '1' } />
      <PostCard setPlayerId={ setPlayerId} playerId={ playerId } id={ '2' } />
      <PostCard setPlayerId={ setPlayerId} playerId={ playerId } id={ '3' } />
      <PostCard setPlayerId={ setPlayerId} playerId={ playerId } id={ '4' } />
      <PostCard setPlayerId={ setPlayerId} playerId={ playerId } id={ '5' } />
      <PostCard setPlayerId={ setPlayerId} playerId={ playerId } id={ '6' } />
      <PostCard setPlayerId={ setPlayerId} playerId={ playerId } id={ '7' } />
      <PostCard setPlayerId={ setPlayerId} playerId={ playerId } id={ '8' } />
      <PostCard setPlayerId={ setPlayerId} playerId={ playerId } id={ '9' } />
      <PostCard setPlayerId={ setPlayerId} playerId={ playerId } id={ '10' } />
      <PostCard setPlayerId={ setPlayerId} playerId={ playerId } id={ '11' } />
    </div>
  )
}