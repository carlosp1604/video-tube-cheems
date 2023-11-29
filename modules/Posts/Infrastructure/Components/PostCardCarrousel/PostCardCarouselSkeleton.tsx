import { FC } from 'react'
import { Carousel, KeyedComponent } from '~/components/Carousel/Carousel'
import * as uuid from 'uuid'
import { PostCardSkeleton } from '~/modules/Posts/Infrastructure/Components/PostCard/PostCardSkeleton/PostCardSkeleton'

interface Props {
  postCardsNumber: number
  loading: boolean
}

export const PostCardCarouselSkeleton: FC<Partial<Props> & Pick<Props, 'postCardsNumber'>> = ({
  postCardsNumber,
  loading = false,
}) => {
  const uuidGenerator = () => {
    return uuid.v4()
  }

  const postCardsSkeleton: KeyedComponent[] = []

  for (let i = 0; i < postCardsNumber; i++) {
    postCardsSkeleton.push({
      key: uuidGenerator(),
      component: <PostCardSkeleton showProducerImage={ true } loading={ loading }/>,
    }
    )
  }

  return (
    <Carousel
      onEndReached={ undefined }
      itemsAutoWidth={ false }
    >
      { postCardsSkeleton }
    </Carousel>
  )
}
