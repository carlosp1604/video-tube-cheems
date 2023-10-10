import styles from './PostOptions.module.scss'
import { FC, useState } from 'react'
import { BsBookmarks, BsChatSquareText, BsDownload, BsMegaphone } from 'react-icons/bs'
import { DownloadMenu } from '~/modules/Posts/Infrastructure/Components/Post/DownloadMenu/DownloadMenu'
import { ReactionType } from '~/modules/Reactions/Infrastructure/ReactionType'
import { RxDividerVertical } from 'react-icons/rx'
import { BiDislike, BiLike, BiSolidDislike, BiSolidLike } from 'react-icons/bi'
import { Tooltip } from 'react-tooltip'
import { NumberFormatter } from '~/modules/Posts/Infrastructure/Frontend/NumberFormatter'
import { ReactionComponentDto } from '~/modules/Reactions/Infrastructure/Components/ReactionComponentDto'
import * as uuid from 'uuid'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { VideoDownloadUrlComponentDto } from '~/modules/Posts/Infrastructure/Dtos/VideoUrlComponentDto'

export interface Props {
  userReaction: ReactionComponentDto | null
  onClickReactButton: (type: ReactionType) => void
  onClickCommentsButton: () => void
  likesNumber: number
  downloadUrls: VideoDownloadUrlComponentDto[]
}

export const PostOptions: FC<Props> = ({
  userReaction,
  onClickReactButton,
  onClickCommentsButton,
  likesNumber,
  downloadUrls,
}) => {
  const [downloadMenuOpen, setDownloadMenuOpen] = useState<boolean>(false)
  const tooltipUuid = uuid.v4()

  let { locale } = useRouter()
  const { t } = useTranslation('post')

  locale = locale ?? 'en'

  return (
    <div className={ styles.postOptions__container }>
      <DownloadMenu
        downloadUrls={ downloadUrls }
        setIsOpen={ setDownloadMenuOpen }
        isOpen={ downloadMenuOpen }
      />

      <span className={ styles.postOptions__likeDislikeSection }>
        {
          userReaction !== null && userReaction.reactionType === ReactionType.LIKE
            ? <BiSolidLike
              className={ styles.postOptions__likeIcon_active }
              onClick={ () => onClickReactButton(ReactionType.LIKE) }
              data-tooltip-id={ tooltipUuid }
              data-tooltip-content={ t('post_reaction_like_button_title') }
            />
            : <BiLike
              className={ styles.postOptions__likeIcon }
              onClick={ () => onClickReactButton(ReactionType.LIKE) }
              data-tooltip-id={ tooltipUuid }
              data-tooltip-content={ t('post_reaction_react_button_title') }
            />
        }
        { NumberFormatter.compatFormat(likesNumber, locale) }
        <RxDividerVertical />
        {
          userReaction !== null && userReaction.reactionType === ReactionType.DISLIKE
            ? <BiSolidDislike
              className={ styles.postOptions__dislikeIcon_active }
              onClick={ () => onClickReactButton(ReactionType.DISLIKE) }
              data-tooltip-id={ tooltipUuid }
              data-tooltip-content={ t('post_reaction_dislike_button_title') }
            />
            : <BiDislike
              className={ styles.postOptions__dislikeIcon }
              onClick={ () => onClickReactButton(ReactionType.DISLIKE) }
              data-tooltip-id={ tooltipUuid }
              data-tooltip-content={ t('post_reaction_react_button_title') }
            />
        }
        <Tooltip id={ tooltipUuid }/>
      </span>
      <span
        className={ styles.postOptions__optionItem }
        onClick={ onClickCommentsButton }
      >
        <BsChatSquareText/>
        { t('post_comments_button_title') }
      </span>
      <span className={ styles.postOptions__optionItem }>
        <BsBookmarks />
        { t('post_save_button_title') }
      </span>
      <span
        className={ styles.postOptions__optionItem }
        onClick={ () => setDownloadMenuOpen(!downloadMenuOpen) }
      >
        <BsDownload />
        { t('post_download_button_title', { sourcesNumber: downloadUrls.length }) }
      </span>
      <span className={ styles.postOptions__optionItem }>
        <BsMegaphone />
        { t('post_report_button_title') }
      </span>
    </div>
  )
}
