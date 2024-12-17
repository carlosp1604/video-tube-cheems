import styles from './PostOptions.module.scss'
import { FC, ReactElement, useState } from 'react'
import { BsGearWide } from 'react-icons/bs'
import { ReactionType } from '~/modules/Reactions/Infrastructure/ReactionType'
import { RxDividerVertical } from 'react-icons/rx'
import { ReactionComponentDto } from '~/modules/Reactions/Infrastructure/Components/ReactionComponentDto'
import useTranslation from 'next-translate/useTranslation'
import { LikeButton } from '~/components/ReactionButton/LikeButton'
import { DislikeButton } from '~/components/ReactionButton/DislikeButton'
import { AiOutlineLoading } from 'react-icons/ai'
import { MediaUrlComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostMedia/MediaUrlComponentDto'
import { MediaUrlsHelper } from '~/modules/Posts/Infrastructure/Frontend/MediaUrlsHelper'
import ReactGA from 'react-ga4'
import {
  ClickDownloadButtonAction,
  VideoPostCategory, DownloadVideoCompletedAction
} from '~/modules/Shared/Infrastructure/FrontEnd/AnalyticsEvents/PostPage'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { PiChatsDuotone } from 'react-icons/pi'
import { MdBookmarkBorder, MdFileDownload } from 'react-icons/md'
import { useToast } from '~/components/AppToast/ToastContext'

const DownloadMenu = dynamic(() => import(
  '~/modules/Posts/Infrastructure/Components/Post/DownloadMenu/DownloadMenu'
).then((module) => module.DownloadMenu), { ssr: false }
)

export interface Props {
  userReaction: ReactionComponentDto | null
  savedPost: boolean
  onClickReactButton: (type: ReactionType) => Promise<void>
  onClickCommentsButton: () => void
  onClickSourcesButton: () => void
  onClickSaveButton: () => Promise<void>
  likesNumber: number
  optionsDisabled: boolean
  downloadUrls: MediaUrlComponentDto[]
  enableDownloads: boolean
  sourcesNumber: number
}

export const PostOptions: FC<Props> = ({
  userReaction,
  savedPost,
  onClickReactButton,
  onClickCommentsButton,
  onClickSourcesButton,
  onClickSaveButton,
  likesNumber,
  optionsDisabled,
  downloadUrls,
  enableDownloads,
  sourcesNumber,
}) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingSaveButton, setLoadingSaveButton] = useState<boolean>(false)
  const [downloadMenuOpen, setDownloadMenuOpen] = useState<boolean>(false)
  const { pathname } = useRouter()

  const { t } = useTranslation('post')
  const { error } = useToast()

  const onClickLikeDislike = async (reactionType: ReactionType) => {
    if (loading || loadingSaveButton) {
      error(t('action_cannot_be_performed_error_message'))

      return
    }

    setLoading(true)
    await onClickReactButton(reactionType)
    setLoading(false)
  }

  const onClickSave = async () => {
    if (loading || loadingSaveButton) {
      error(t('action_cannot_be_performed_error_message'))

      return
    }

    setLoadingSaveButton(true)
    setLoading(true)
    await onClickSaveButton()
    setLoading(false)
    setLoadingSaveButton(false)
  }

  const onClickDownloadButton = async () => {
    if (downloadUrls.length > 0) {
      setDownloadMenuOpen(!downloadMenuOpen)

      return
    }
    error(t('post_download_no_downloads_error_message'))
  }

  let downloadMenu: ReactElement | null = null
  let downloadButton: ReactElement | null = null
  let sourcesButton: ReactElement | null = null

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
        onClick={ async () => {
          ReactGA.event({
            category: VideoPostCategory,
            action: ClickDownloadButtonAction,
            label: pathname,
          })
          await onClickDownloadButton()
        } }
      >
        <MdFileDownload className={ styles.postOptions__optionItemIcon }/>
        { t('post_download_button_title') }
        <span className={ styles.postOptions__optionItemQuantity }>
          { downloadUrls.length }
        </span>
      </span>
    )
  }

  if (sourcesNumber > 1) {
    sourcesButton = (
      <button
        className={ styles.postOptions__optionItem }
        onClick={ onClickSourcesButton }
      >
        <BsGearWide className={ styles.postOptions__optionItemIcon }/>
        { t('post_sources_button_title') }
        <span className={ styles.postOptions__optionItemQuantity }>
          { sourcesNumber }
        </span>
      </button>
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
      { sourcesButton }
      <span
        className={ styles.postOptions__optionItem }
        onClick={ onClickCommentsButton }
      >
        <PiChatsDuotone className={ styles.postOptions__optionItemIcon }/>
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
          : <MdBookmarkBorder className={ styles.postOptions__optionItemIcon } /> }
        { savedPost ? t('post_save_active_button_title') : t('post_save_button_title') }
      </button>
      { downloadButton }
    </div>
  )
}
