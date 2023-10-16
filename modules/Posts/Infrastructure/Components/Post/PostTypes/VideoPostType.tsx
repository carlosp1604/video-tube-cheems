import { FC, ReactElement } from 'react'
import { PostComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostComponentDto'
import { VideoPostPlayer } from '~/modules/Posts/Infrastructure/Components/Post/VideoPostPlayer/VideoPostPlayer'
import { PostBasicData } from '~/modules/Posts/Infrastructure/Components/Post/PostData/PostBasicData'
import { PostOptions } from '~/modules/Posts/Infrastructure/Components/Post/PostOptions/PostOptions'
import styles from './PostType.module.scss'
import { ReactionComponentDto } from '~/modules/Reactions/Infrastructure/Components/ReactionComponentDto'
import { ReactionType } from '~/modules/Reactions/Infrastructure/ReactionType'
import { MediaUrlComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostMedia/MediaUrlComponentDto'

export interface Props {
  post: PostComponentDto
  viewsNumber: number
  likesNumber: number
  dislikesNumber: number
  commentsNumber: number
  userReaction: ReactionComponentDto | null
  onClickReactButton: (reactionType: ReactionType) => void
  onClickCommentsButton: () => void
}

export const VideoPostType: FC<Props> = ({
  post,
  viewsNumber,
  likesNumber,
  dislikesNumber,
  commentsNumber,
  userReaction,
  onClickReactButton,
  onClickCommentsButton,
}) => {
  let videoPlayer: ReactElement
  let mediaUrls: MediaUrlComponentDto[] = []

  if (post.postMedia.length > 0) {
    videoPlayer = (
      <VideoPostPlayer
        playerId={ post.id }
        embedUrls={ post.postMedia[0].embedUrls }
        videoUrls={ post.postMedia[0].videoUrls }
      />
    )

    mediaUrls = [...post.postMedia[0].embedUrls, ...post.postMedia[0].videoUrls]
  } else {
    videoPlayer = (
      <VideoPostPlayer
        playerId={ post.id }
        embedUrls={ [] }
        videoUrls={ [] }
      />
    )
  }

  return (
    <>
      <div className={ styles.postType__videoContainer } >
        { videoPlayer }
      </div>

      <PostBasicData
        post={ post }
        postViewsNumber={ viewsNumber }
        postLikes={ likesNumber }
        postDislikes={ dislikesNumber }
        postCommentsNumber={ commentsNumber }
      />

      <PostOptions
        userReaction={ userReaction }
        onClickReactButton={ (type) => onClickReactButton(type) }
        onClickCommentsButton={ onClickCommentsButton }
        likesNumber={ likesNumber }
        mediaUrls={ mediaUrls }
      />
    </>
  )
}
