import styles from './PostOptions.module.scss'
import { FC, useState } from 'react'
import { BsBookmarks, BsChatSquareText, BsDownload, BsMegaphone } from 'react-icons/bs'
import { DownloadMenu } from '~/modules/Posts/Infrastructure/Components/Post/DownloadMenu/DownloadMenu'
import { ReactionType } from '~/modules/Reactions/Infrastructure/ReactionType'
import { RxDividerVertical } from 'react-icons/rx'
import { ReactionComponentDto } from '~/modules/Reactions/Infrastructure/Components/ReactionComponentDto'
import * as uuid from 'uuid'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { MediaUrlComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostMedia/MediaUrlComponentDto'
import toast from 'react-hot-toast'
import { LikeButton } from '~/components/ReactionButton/LikeButton'
import { DislikeButton } from '~/components/ReactionButton/DislikeButton'

export interface Props {
  userReaction: ReactionComponentDto | null
  savedPost: boolean
  onClickReactButton: (type: ReactionType) => void
  onClickCommentsButton: () => void
  onClickSaveButton: () => void
  likesNumber: number
  mediaUrls: MediaUrlComponentDto[]
}

export const PostOptions: FC<Props> = ({
  userReaction,
  savedPost,
  onClickReactButton,
  onClickCommentsButton,
  onClickSaveButton,
  likesNumber,
  mediaUrls,
}) => {
  const [downloadMenuOpen, setDownloadMenuOpen] = useState<boolean>(false)
  const tooltipUuid = uuid.v4()

  let { locale } = useRouter()
  const { t } = useTranslation('post')

  locale = locale ?? 'en'

  return (
    <div className={ styles.postOptions__container }>
      <DownloadMenu
        mediaUrls={ mediaUrls }
        setIsOpen={ setDownloadMenuOpen }
        isOpen={ downloadMenuOpen }
      />

      <span className={ styles.postOptions__likeDislikeSection }>
        <LikeButton
          liked={ userReaction !== null && userReaction.reactionType === ReactionType.LIKE }
          onLike={ () => onClickReactButton(ReactionType.LIKE) }
          onDeleteLike={ () => onClickReactButton(ReactionType.LIKE) }
          reactionsNumber={ likesNumber }
        />
        <RxDividerVertical />
        <DislikeButton
          disliked={ userReaction !== null && userReaction.reactionType === ReactionType.DISLIKE }
          onDislike={ () => onClickReactButton(ReactionType.DISLIKE) }
          onDeleteDislike={ () => onClickReactButton(ReactionType.DISLIKE) }
        />
      </span>
      <span
        className={ styles.postOptions__optionItem }
        onClick={ onClickCommentsButton }
      >
        <BsChatSquareText/>
        { t('post_comments_button_title') }
      </span>
      <span
        className={ `
          ${styles.postOptions__optionItem}
          ${savedPost ? styles.postOptions__optionItem_active : ''}
        ` }
        onClick={ onClickSaveButton }
      >
        <BsBookmarks />
        { savedPost ? t('post_save_active_button_title') : t('post_save_button_title') }
      </span>
      <span
        className={ styles.postOptions__optionItem }
        onClick={ () => {
          if (mediaUrls.length > 0) {
            setDownloadMenuOpen(!downloadMenuOpen)

            return
          }
          toast.error(t('post_download_no_downloads_error_message'))
        } }
      >
        <BsDownload />
        { t('post_download_button_title', { sourcesNumber: mediaUrls.length }) }
      </span>
      <span
        className={ styles.postOptions__optionItem }
        onClick={ () => { toast.success(t('post_option_feature_not_available_message')) } }
      >
        <BsMegaphone />
        { t('post_report_button_title') }
      </span>
    </div>
  )
}
