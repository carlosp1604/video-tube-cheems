import { Dispatch, FC, SetStateAction } from 'react'
import styles from './PostCardList.module.scss'
import { PostCard } from './PostCard'
import { PostCardComponentDto } from '../Dtos/PostCardComponentDto'

interface Props {
  playerId: string
  setPlayerId: Dispatch<SetStateAction<string>>
  posts: PostCardComponentDto[]
}

export const PostCardList: FC<Props> = ({ playerId, setPlayerId, posts }) => {
  return (
    <div className={ styles.postCardList__container }>
      { posts.map((post) => {
        return (
          <PostCard
            setPlayerId={ setPlayerId}
            playerId={ playerId }
            post={ post }
            key={ post.id }
          />
        )
      })}
    </div>
  )
}