import { Dispatch, FC, SetStateAction } from 'react'
import styles from './PostCardList.module.scss'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import { PostCard } from '~/modules/Posts/Infrastructure/Components/PostCard/PostCard'

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
            showProducerImage={ true }
            setPlayerId={ setPlayerId }
            playerId={ playerId }
            post={ post }
            key={ post.id }
          />)
      }) }
    </div>
  )
}
