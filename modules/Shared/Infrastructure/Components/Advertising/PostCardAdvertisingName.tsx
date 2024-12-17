import { FC } from 'react'
import { RiAdvertisementFill } from 'react-icons/ri'
import styles
  from '~/modules/Posts/Infrastructure/Components/PostCard/PostCardProducerActor/PostCardProducerActor.module.scss'

interface Props {
  name: string
}

export const PostCardAdvertisingName: FC<Props> = ({ name }) => {
  return (
    <div className={ styles.postCardProducerActor__producerTitle }>
      <RiAdvertisementFill className={ styles.postCardProducerActor__producerIconAd }/>
      { name }
    </div>
  )
}
