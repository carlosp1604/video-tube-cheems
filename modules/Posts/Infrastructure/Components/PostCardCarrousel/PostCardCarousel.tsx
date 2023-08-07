import { FC } from 'react'
import { Carousel } from '~/components/Carousel/Carousel'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import { PostCard } from '~/modules/Posts/Infrastructure/Components/PostCard/PostCard'

interface Props {
  posts: PostCardComponentDto[]
}

export const PostCardCarousel: FC<Props> = ({ posts }) => {
  return (
    <Carousel onEndReached={ undefined }>
      { posts.map((post) => {
        return ({
          key: post.id,
          component:
            <PostCard
              post={ post }
              key={ post.id }
              showProducerImage={ false }
            />,
        })
      }) }
    </Carousel>
  )
}
