import { FC, useEffect, useState } from 'react'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import styles from './PostCardWithOptions.module.scss'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { PostCard } from '~/modules/Posts/Infrastructure/Components/PostCard/PostCard'
import { v4 as uuidv4 } from 'uuid'
import useTranslation from 'next-translate/useTranslation'
import dynamic from 'next/dynamic'

interface Props {
  post: PostCardComponentDto
  showOptionsButton: boolean
  onClickOptions: (postId: string) => void
}

const Tooltip = dynamic(() => import(
  '~/components/Tooltip/Tooltip').then((module) => module.Tooltip), { ssr: false }
)

export const PostCardWithOptions: FC<Props> = ({
  post,
  showOptionsButton,
  onClickOptions,
}) => {
  const { t } = useTranslation('post_card')
  const [mounted, setMounted] = useState<boolean>(false)
  const [tooltipId, setTooltipId] = useState<string>('')

  useEffect(() => {
    setMounted(true)
    setTooltipId(uuidv4())
  }, [])

  return (
    <div className={ styles.postCardWithOptions__container }>
      <PostCard
        post={ post }
      />
      <button className={ `
        ${styles.postCardWithOptions__postOptions}
        ${showOptionsButton ? styles.postCardWithOptions__postOptions_visible : ''}
      ` }
        onClick={ () => { if (onClickOptions) { onClickOptions(post.id) } } }
        data-tooltip-id={ tooltipId }
      >
        <BsThreeDotsVertical/>
        { mounted &&
          <Tooltip
            tooltipId={ tooltipId }
            place={ 'top' }
            content={ t('post_card_options_button_title') }
          /> }
      </button>
    </div>
  )
}
