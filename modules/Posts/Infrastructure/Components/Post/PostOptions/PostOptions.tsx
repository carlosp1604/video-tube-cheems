import styles from './PostOptions.module.scss'
import { FC, useState } from 'react'
import { BsBookmarks, BsChatSquareText, BsDownload, BsMegaphone } from 'react-icons/bs'
import { DownloadMenu } from '~/modules/Posts/Infrastructure/Components/Post/DownloadMenu/DownloadMenu'
import { ReactionType } from '~/modules/Reactions/Infrastructure/ReactionType'
import { RxDividerVertical } from 'react-icons/rx'
import { ReactionComponentDto } from '~/modules/Reactions/Infrastructure/Components/ReactionComponentDto'
import { useTranslation } from 'next-i18next'
import { MediaUrlComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostMedia/MediaUrlComponentDto'
import toast from 'react-hot-toast'
import { LikeButton } from '~/components/ReactionButton/LikeButton'
import { DislikeButton } from '~/components/ReactionButton/DislikeButton'
import { AiOutlineLoading } from 'react-icons/ai'

export interface Props {
  userReaction: ReactionComponentDto | null
  savedPost: boolean
  onClickReactButton: (type: ReactionType) => Promise<void>
  onClickCommentsButton: () => void
  onClickSaveButton: () => Promise<void>
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
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingSaveButton, setLoadingSaveButton] = useState<boolean>(false)

  const { t } = useTranslation('post')

  const onClickLikeDislike = async (reactionType: ReactionType) => {
    if (loading) {
      toast.error(t('action_cannot_be_performed_error_message'))

      return
    }

    setLoading(true)
    await onClickReactButton(reactionType)
    setLoading(false)
  }

  const onClickSave = async () => {
    if (loading || loadingSaveButton) {
      toast.error(t('action_cannot_be_performed_error_message'))

      return
    }

    setLoadingSaveButton(true)
    setLoading(true)
    await onClickSaveButton()
    setLoading(false)
    setLoadingSaveButton(false)
  }

  return (
    <div className={ styles.postOptions__container }>
      <DownloadMenu
        mediaUrls={ mediaUrls }
        setIsOpen={ setDownloadMenuOpen }
        isOpen={ downloadMenuOpen }
      />

      <span className={ `
        ${styles.postOptions__likeDislikeSection}
        ${loading ? styles.postOptions__likeDislikeSection_disabled : ''}
      ` }>
        <LikeButton
          liked={ userReaction !== null && userReaction.reactionType === ReactionType.LIKE }
          onLike={ () => onClickLikeDislike(ReactionType.LIKE) }
          onDeleteLike={ () => onClickLikeDislike(ReactionType.LIKE) }
          reactionsNumber={ likesNumber }
          disabled={ loading }
        />
        <RxDividerVertical />
        <DislikeButton
          disliked={ userReaction !== null && userReaction.reactionType === ReactionType.DISLIKE }
          onDislike={ () => onClickLikeDislike(ReactionType.DISLIKE) }
          onDeleteDislike={ () => onClickLikeDislike(ReactionType.DISLIKE) }
          disabled={ loading }
        />
      </span>
      <span
        className={ styles.postOptions__optionItem }
        onClick={ onClickCommentsButton }
      >
        <BsChatSquareText/>
        { t('post_comments_button_title') }
      </span>
      <button className={ `
        ${styles.postOptions__optionItem}
        ${savedPost ? styles.postOptions__optionItem_active : ''}
      ` }
        onClick={ onClickSave }
        disabled={ loading }
      >
        { loadingSaveButton ? <AiOutlineLoading className={ styles.postOptions__loadingIcon } /> : <BsBookmarks /> }
        { savedPost ? t('post_save_active_button_title') : t('post_save_button_title') }
      </button>
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
