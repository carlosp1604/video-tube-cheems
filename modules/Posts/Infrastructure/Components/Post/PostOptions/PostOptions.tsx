import styles from './PostOptions.module.scss'
import { FC, ReactElement, useState } from 'react'
import { BsBookmarks, BsChatSquareText, BsDownload, BsMegaphone } from 'react-icons/bs'
import { ReactionType } from '~/modules/Reactions/Infrastructure/ReactionType'
import { RxDividerVertical } from 'react-icons/rx'
import { ReactionComponentDto } from '~/modules/Reactions/Infrastructure/Components/ReactionComponentDto'
import { useTranslation } from 'next-i18next'
import toast from 'react-hot-toast'
import { LikeButton } from '~/components/ReactionButton/LikeButton'
import { DislikeButton } from '~/components/ReactionButton/DislikeButton'
import { AiOutlineLoading } from 'react-icons/ai'
import { DownloadMenu } from '~/modules/Posts/Infrastructure/Components/Post/DownloadMenu/DownloadMenu'
import { MediaUrlComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostMedia/MediaUrlComponentDto'
import { MediaUrlsHelper } from '~/modules/Posts/Infrastructure/Frontend/MediaUrlsHelper'
import ReactGA from 'react-ga4'
import {
  ClickDownloadButtonAction,
  VideoPostCategory, DownloadVideoCompletedAction
} from '~/modules/Shared/Infrastructure/FrontEnd/AnalyticsEvents/PostPage'
import { useRouter } from 'next/router'

export interface Props {
  userReaction: ReactionComponentDto | null
  savedPost: boolean
  onClickReactButton: (type: ReactionType) => Promise<void>
  onClickCommentsButton: () => void
  onClickSaveButton: () => Promise<void>
  likesNumber: number
  optionsDisabled: boolean
  downloadUrls: MediaUrlComponentDto[]
  enableDownloads: boolean
}

export const PostOptions: FC<Props> = ({
  userReaction,
  savedPost,
  onClickReactButton,
  onClickCommentsButton,
  onClickSaveButton,
  likesNumber,
  optionsDisabled,
  downloadUrls,
  enableDownloads,
}) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingSaveButton, setLoadingSaveButton] = useState<boolean>(false)
  const [downloadMenuOpen, setDownloadMenuOpen] = useState<boolean>(false)
  const { pathname } = useRouter()

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

  const onClickDownloadButton = () => {
    if (downloadUrls.length > 0) {
      setDownloadMenuOpen(!downloadMenuOpen)

      return
    }
    toast.error(t('post_download_no_downloads_error_message'))
  }

  let downloadMenu: ReactElement | null = null
  let downloadButton: ReactElement | null = null

  if (enableDownloads) {
    downloadMenu = (
      <DownloadMenu
        mediaUrls={ MediaUrlsHelper.sortMediaUrl(downloadUrls) }
        setIsOpen={ setDownloadMenuOpen }
        isOpen={ downloadMenuOpen }
        onClickOption={ (mediaUrl: MediaUrlComponentDto) => {
          ReactGA.event({
            category: VideoPostCategory,
            action: DownloadVideoCompletedAction,
            label: mediaUrl.provider.name,
          })
        } }
      />
    )

    downloadButton = (
      <span
        className={ styles.postOptions__optionItem }
        onClick={ () => {
          ReactGA.event({
            category: VideoPostCategory,
            action: ClickDownloadButtonAction,
            label: pathname,
          })
          onClickDownloadButton()
        } }
      >
        <BsDownload className={ styles.postOptions__optionItemIcon }/>
        { t('post_download_button_title', { sourcesNumber: downloadUrls.length }) }
      </span>
    )
  }

  return (
    <div className={ styles.postOptions__container }>
      { downloadMenu }

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
        <BsChatSquareText className={ styles.postOptions__optionItemIcon }/>
        { t('post_comments_button_title') }
      </span>
      <button className={ `
        ${styles.postOptions__optionItem}
        ${savedPost ? styles.postOptions__optionItem_active : ''}
      ` }
        onClick={ onClickSave }
        disabled={ loading || optionsDisabled }
      >
        { loadingSaveButton
          ? <AiOutlineLoading className={ styles.postOptions__loadingIcon } />
          : <BsBookmarks className={ styles.postOptions__optionItemIcon } /> }
        { savedPost ? t('post_save_active_button_title') : t('post_save_button_title') }
      </button>
      { downloadButton }
      <span
        className={ styles.postOptions__optionItem }
        onClick={ () => { toast.success(t('post_option_feature_not_available_message')) } }
      >
        <BsMegaphone className={ styles.postOptions__optionItemIcon }/>
        { t('post_report_button_title') }
      </span>
    </div>
  )
}
