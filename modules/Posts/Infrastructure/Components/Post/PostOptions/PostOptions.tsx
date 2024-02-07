import styles from './PostOptions.module.scss'
import { FC, useState } from 'react'
import { BsBookmarks, BsChatSquareText, BsDownload, BsMegaphone } from 'react-icons/bs'
import { ReactionType } from '~/modules/Reactions/Infrastructure/ReactionType'
import { RxDividerVertical } from 'react-icons/rx'
import { ReactionComponentDto } from '~/modules/Reactions/Infrastructure/Components/ReactionComponentDto'
import { useTranslation } from 'next-i18next'
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
  onClickDownloadButton: () => void
  likesNumber: number
  downloadUrlNumber: number
  optionsDisabled: boolean
}

export const PostOptions: FC<Props> = ({
  userReaction,
  savedPost,
  onClickReactButton,
  onClickCommentsButton,
  onClickSaveButton,
  onClickDownloadButton,
  likesNumber,
  downloadUrlNumber,
  optionsDisabled,
}) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingSaveButton, setLoadingSaveButton] = useState<boolean>(false)

  const { t } = useTranslation('post')

  const onClickLikeDislike = async (reactionType: ReactionType) => {
    if (loading || loadingSaveButton) {
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
      <span className={ `
        ${styles.postOptions__likeDislikeSection}
        ${loading || optionsDisabled ? styles.postOptions__likeDislikeSection_disabled : ''}
      ` }>
        <LikeButton
          liked={ userReaction !== null && userReaction.reactionType === ReactionType.LIKE }
          onLike={ () => onClickLikeDislike(ReactionType.LIKE) }
          onDeleteLike={ () => onClickLikeDislike(ReactionType.LIKE) }
          reactionsNumber={ likesNumber }
          disabled={ loading || optionsDisabled }
        />
        <RxDividerVertical className={ styles.postOptions__likeDislikeSeparator }/>
        <DislikeButton
          disliked={ userReaction !== null && userReaction.reactionType === ReactionType.DISLIKE }
          onDislike={ () => onClickLikeDislike(ReactionType.DISLIKE) }
          onDeleteDislike={ () => onClickLikeDislike(ReactionType.DISLIKE) }
          disabled={ loading || optionsDisabled }
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
        disabled={ loading || optionsDisabled }
      >
        { loadingSaveButton ? <AiOutlineLoading className={ styles.postOptions__loadingIcon } /> : <BsBookmarks /> }
        { savedPost ? t('post_save_active_button_title') : t('post_save_button_title') }
      </button>
      <span
        className={ styles.postOptions__optionItem }
        onClick={ () => onClickDownloadButton() }
      >
        <BsDownload />
        { t('post_download_button_title', { sourcesNumber: downloadUrlNumber }) }
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
