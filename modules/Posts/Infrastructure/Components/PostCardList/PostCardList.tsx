import { FC } from 'react'
import styles from './PostCardList.module.scss'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import { PostCard } from '~/modules/Posts/Infrastructure/Components/PostCard/PostCard'

// TODO: Implement post card options
export enum PostCardAction {
  SAVE_POST = 'save',
  DELETE_POST = 'delete'
}

interface PostCardOption {
  action: PostCardAction
  onClick: (postId: string) => void
}

interface Props {
  posts: PostCardComponentDto[]
  // TODO: Implement post card options
  // options: PostCardOption[]
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
          />
        )
      }) }
    </div>
  )
}
