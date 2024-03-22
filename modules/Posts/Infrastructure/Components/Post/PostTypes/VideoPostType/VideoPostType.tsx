import { FC, ReactElement } from 'react'
import { PostComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostComponentDto'
import { VideoPostPlayer } from '~/modules/Posts/Infrastructure/Components/Post/VideoPostPlayer/VideoPostPlayer'
import styles from './VideoPostType.module.scss'
import { ReactionComponentDto } from '~/modules/Reactions/Infrastructure/Components/ReactionComponentDto'
import { ReactionType } from '~/modules/Reactions/Infrastructure/ReactionType'
import { PostOptions } from '~/modules/Posts/Infrastructure/Components/Post/PostOptions/PostOptions'
import { MediaUrlsHelper } from '~/modules/Posts/Infrastructure/Frontend/MediaUrlsHelper'
import { useTranslation } from 'next-i18next'

export interface Props {
  post: PostComponentDto
  postBasicDataElement: ReactElement
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
  postBasicDataElement,
  userReaction,
  savedPost,
  onClickReactButton,
  onClickCommentsButton,
  onClickSaveButton,
  likesNumber,
  optionsDisabled,
}) => {
  const downloadUrls = MediaUrlsHelper.getVideoDownloadUrl(post.postMediaVideoType, post.postMediaEmbedType)
  const { t } = useTranslation('post')

  return (
    <>
      <div className={ styles.videoPostType__videoContainer } >
        <VideoPostPlayer
          title={ t('post_player_title', { postName: post.title }) }
          embedPostMedia={ post.postMediaEmbedType.length > 0 ? post.postMediaEmbedType[0] : null }
          videoPostMedia={ post.postMediaVideoType.length > 0 ? post.postMediaVideoType[0] : null }
        />
      </div>

      { postBasicDataElement }

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
      />
    </>
  )
}
