import { FC } from 'react'
import styles from './PostCardList.module.scss'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import { PostCard } from '~/modules/Posts/Infrastructure/Components/PostCard/PostCard'

interface Props {
  posts: PostCardComponentDto[]
}

export const PostCardList: FC<Props> = ({ posts }) => {
  return (
    <div className={ styles.postCardList__container }>
      { posts.map((post) => {
        return (
          <PostCard
            showProducerImage={ true }
            post={ post }
            key={ post.id }
          />)
      }) }
    </div>
  )
}
