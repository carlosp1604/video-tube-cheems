import { FC, ReactNode, useMemo, useRef, useState } from 'react'
import { PostComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostComponentDto'
import { VideoPostPlayer } from '~/modules/Posts/Infrastructure/Components/Post/VideoPostPlayer/VideoPostPlayer'
import styles from './VideoPostType.module.scss'
import { ReactionComponentDto } from '~/modules/Reactions/Infrastructure/Components/ReactionComponentDto'
import { ReactionType } from '~/modules/Reactions/Infrastructure/ReactionType'
import { PostOptions } from '~/modules/Posts/Infrastructure/Components/Post/PostOptions/PostOptions'
import { MediaUrlsHelper } from '~/modules/Posts/Infrastructure/Frontend/MediaUrlsHelper'
import useTranslation from 'next-translate/useTranslation'
import { useSession } from 'next-auth/react'
import { BsFileEarmarkBreak } from 'react-icons/bs'
import {
  CrackrevenuePostPageBanner
} from '~/modules/Shared/Infrastructure/Components/Advertising/Crackrevenue/CrackrevenuePostPageBanner'

export interface Props {
  post: PostComponentDto
  userReaction: ReactionComponentDto | null
  savedPost: boolean
  onClickReactButton: (type: ReactionType) => Promise<void>
  onClickCommentsButton: () => void
  onClickSaveButton: () => Promise<void>
  likesNumber: number
  optionsDisabled: boolean
}

export const VideoPostType: FC<Props> = ({
  post,
  userReaction,
  savedPost,
  onClickReactButton,
  onClickCommentsButton,
  onClickSaveButton,
  likesNumber,
  optionsDisabled,
}) => {
  const { t } = useTranslation('post')
  const { data } = useSession()

  const [sourcesMenuOpen, setSourcesMenuOpen] = useState<boolean>(false)
  const playerRef = useRef<HTMLDivElement>(null)

  const downloadUrls = useMemo(() => {
    return MediaUrlsHelper.getVideoDownloadUrl(post.postMediaVideoType, post.postMediaEmbedType)
  }, [post.postMediaVideoType, post.postMediaEmbedType])

  const selectableUrls = useMemo(() => {
    return MediaUrlsHelper.getSelectableUrls(
      post.postMediaEmbedType,
      post.postMediaVideoType,
      data ? data.user.id : null
    )
  }, [post.postMediaEmbedType, post.postMediaVideoType, data])

  let player: ReactNode = (
    <div className={ styles.videoPostType__noSourcesState }>
      <BsFileEarmarkBreak className={ styles.videoPostType__noSourcesStateIcon }/>
      { t('post_video_no_sources_error_message') }
    </div>
  )

  if (selectableUrls.length > 0) {
    player = (
      <VideoPostPlayer
        title={ t('post_player_title', { postName: post.title }) }
        selectableUrls={ selectableUrls }
        sourcesMenuOpen={ sourcesMenuOpen }
        onCloseSourceMenu={ () => setSourcesMenuOpen(false) }
      />
    )
  }

  return (
    <>
      <div className={ styles.videoPostType__videoWithAds }>
        <div
          className={ styles.videoPostType__videoContainer }
          ref={ playerRef }
        >
          { player }
        </div>
        <div className={ styles.videoPostType__advertising }>
          <CrackrevenuePostPageBanner />
        </div>
      </div>

      <h1 className={ styles.videoPostType__postTitle }>
        { post.title }
      </h1>

      <PostOptions
        userReaction={ userReaction }
        savedPost={ savedPost }
        onClickReactButton={ async (type) => await onClickReactButton(type) }
        onClickCommentsButton={ onClickCommentsButton }
        onClickSaveButton={ async () => await onClickSaveButton() }
        likesNumber={ likesNumber }
        optionsDisabled={ optionsDisabled }
        downloadUrls={ downloadUrls }
        enableDownloads={ true }
        onClickSourcesButton={ () => {
          if (!sourcesMenuOpen && playerRef.current) {
            playerRef.current.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
            })
          }
          setSourcesMenuOpen(!sourcesMenuOpen)
        } }
        sourcesNumber={ selectableUrls.length }
      />
    </>
  )
}
