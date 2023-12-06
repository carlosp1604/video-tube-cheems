import { FC, useMemo } from 'react'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import styles from './PostCardWithOptions.module.scss'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { PostCard } from '~/modules/Posts/Infrastructure/Components/PostCard/PostCard'
import { Tooltip } from 'react-tooltip'
import * as uuid from 'uuid'
import { useTranslation } from 'next-i18next'

interface Props {
  post: PostCardComponentDto
  showOptionsButton: boolean
  showProducerImage: boolean
  onClickOptions: (postId: string) => void
}

export const PostCardWithOptions: FC<Props> = ({
  post,
  showOptionsButton,
  onClickOptions,
  showProducerImage,
}) => {
  const { t } = useTranslation('post_card')
  const tooltipUuid = useMemo(() => uuid.v4(), [])

  return (
    <div className={ styles.postCardWithOptions__container }>
      <PostCard
        showProducerImage={ showProducerImage }
        post={ post }
      />
      <button className={ `
        ${styles.postCardWithOptions__postOptions}
        ${showOptionsButton ? styles.postCardWithOptions__postOptions_visible : ''}
      ` }
        onClick={ () => { if (onClickOptions) { onClickOptions(post.id) } } }
        data-tooltip-id={ tooltipUuid }
        data-tooltip-content={ t('post_card_options_button_title') }
      >
        <BsThreeDotsVertical/>
        <Tooltip id={ tooltipUuid }/>
      </button>
    </div>
  )
}
