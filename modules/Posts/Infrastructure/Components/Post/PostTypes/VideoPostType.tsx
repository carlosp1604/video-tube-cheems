import { FC, useMemo } from 'react'
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
  const getMediaUrls = (): MediaUrlComponentDto[] => {
    let mediaUrls: MediaUrlComponentDto[] = []

    if (post.postMediaEmbedType.length > 0) {
      mediaUrls = [...mediaUrls, ...post.postMediaEmbedType[0].urls]
    }

    if (post.postMediaVideoType.length > 0) {
      mediaUrls = [...mediaUrls, ...post.postMediaVideoType[0].urls]
    }

    return mediaUrls
  }

  const mediaUrls = useMemo(() => getMediaUrls(), [post])

  return (
    <>
      <div className={ styles.postType__videoContainer } >
        <VideoPostPlayer
          mediaUrls={ mediaUrls }
          embedPostMedia={ post.postMediaEmbedType.length > 0 ? post.postMediaEmbedType[0] : null }
          videoPostMedia={ post.postMediaVideoType.length > 0 ? post.postMediaVideoType[0] : null }
        />
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
