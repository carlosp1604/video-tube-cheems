import styles from './Post.module.scss'
import { FC, ReactElement, useEffect, useRef, useState } from 'react'
import { PostComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostComponentDto'
import { ReactionComponentDto } from '~/modules/Reactions/Infrastructure/Components/ReactionComponentDto'
import {
  ReactionComponentDtoTranslator
} from '~/modules/Reactions/Infrastructure/Components/ReactionComponentDtoTranslator'
import { PostsApiService } from '~/modules/Posts/Infrastructure/Frontend/PostsApiService'
import { useSession } from 'next-auth/react'
import { ReactionType } from '~/modules/Reactions/Infrastructure/ReactionType'
import { PostTypeResolver } from '~/modules/Posts/Infrastructure/Components/Post/PostTypes/PostTypeResolver'
import { useReactPost } from '~/hooks/ReactPost'
import { PostData } from '~/modules/Posts/Infrastructure/Components/Post/PostData/PostData'
import dynamic from 'next/dynamic'
import { useSavePost } from '~/hooks/SavePosts'
import { MediaQueryBreakPoints, useMediaQuery } from '~/hooks/MediaQuery'
import TrafficstarsDesktopBanner
  from '~/modules/Shared/Infrastructure/Components/Advertising/Trafficstars/TrafficstarsDesktopBanner'

const PostComments = dynamic(() =>
  import('~/modules/Posts/Infrastructure/Components/PostComment/PostComments').then((module) => module.PostComments),
{ ssr: false }
)

export interface Props {
  post: PostComponentDto
  postViewsNumber: number
}

export const Post: FC<Props> = ({
  post,
  postViewsNumber,
}) => {
  const [likesNumber, setLikesNumber] = useState<number>(0)
  const [dislikesNumber, setDislikesNumber] = useState<number>(0)
  const [viewsNumber, setViewsNumber] = useState<number>(postViewsNumber)
  const [userReaction, setUserReaction] = useState<ReactionComponentDto | null>(null)
  const [commentsOpen, setCommentsOpen] = useState<boolean>(false)
  const [savedPost, setSavedPost] = useState<boolean>(false)
  const [optionsDisabled, setOptionsDisabled] = useState<boolean>(true)
  const activeBreakpoint = useMediaQuery()

  const postsApiService = new PostsApiService()
  const commentsRef = useRef<HTMLDivElement>(null)

  const { savePost, removeSavedPost } = useSavePost('post')
  const { reactPost, removeReaction } = useReactPost('post')

  const { status } = useSession()

  useEffect(() => {
    if (status === 'unauthenticated') {
      setUserReaction(null)
      setSavedPost(false)
      setOptionsDisabled(false)
    }

    if (status === 'authenticated') {
      postsApiService.getPostUserInteraction(post.id)
        .then((response) => {
          if (response.userReaction === null) {
            setUserReaction(null)
          } else {
            const userReactionDto =
              ReactionComponentDtoTranslator.fromApplicationDto(response.userReaction)

            setUserReaction(userReactionDto)
          }

          setSavedPost(response.savedPost)
        })
        .catch((exception) => {
          console.error(exception)
        })
        .finally(() => { setOptionsDisabled(false) })
    }

    if (commentsOpen) {
      setCommentsOpen(false)
      new Promise(resolve => setTimeout(resolve, 100)).then(() => {
        setCommentsOpen(true)
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  useEffect(() => {
    postsApiService.addPostView(post.id)
      .then((response) => {
        setViewsNumber(response.postViews)
      })
      .catch((exception) => {
        console.error(exception)
      })

    postsApiService.getPostReactionsCount(post.id)
      .then((response) => {
        setLikesNumber(response.likes)
        setDislikesNumber(response.dislikes)
      })
      .catch((exception) => {
        console.error(exception)
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  let commentsComponent: ReactElement | null = null

  if (commentsOpen) {
    commentsComponent = (
      <PostComments
        key={ post.id }
        postId={ post.id }
        setIsOpen={ setCommentsOpen }
      />
    )
  }

  const onClickCommentsButton = () => {
    const currentValue = commentsOpen

    setCommentsOpen(!commentsOpen)

    if (!currentValue && (activeBreakpoint <= MediaQueryBreakPoints.TB)) {
      commentsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const onClickReactButton = async (type: ReactionType) => {
    if (userReaction !== null && userReaction.reactionType === type) {
      const deletedReaction = await removeReaction(post.id)

      if (deletedReaction) {
        if (userReaction.reactionType === ReactionType.LIKE) {
          setLikesNumber(likesNumber - 1)
        } else {
          setDislikesNumber(dislikesNumber - 1)
        }
        setUserReaction(null)
      }
    } else {
      const userPostReaction = await reactPost(post.id, type)

      if (userPostReaction === null) {
        return
      }

      if (userReaction !== null) {
        if (userPostReaction.reactionType === ReactionType.LIKE) {
          setLikesNumber(likesNumber + 1)
          setDislikesNumber(dislikesNumber - 1)
        } else {
          setLikesNumber(likesNumber - 1)
          setDislikesNumber(dislikesNumber + 1)
        }
      } else {
        if (userPostReaction.reactionType === ReactionType.LIKE) {
          setLikesNumber(likesNumber + 1)
        } else {
          setDislikesNumber(dislikesNumber + 1)
        }
      }

      setUserReaction(userPostReaction)
    }
  }

  const onClickSavePostButton = async () => {
    if (!savedPost) {
      const postIsSaved = await savePost(post.id)

      setSavedPost(postIsSaved)
    } else {
      const postIsDeleted = await removeSavedPost(post.id)

      setSavedPost(!postIsDeleted)
    }
  }

  return (
    <div className={ styles.post__container }>
      <section className={ styles.post__postWithAds }>
        <div className={ styles.post__leftContainer }>
          { PostTypeResolver.resolve(
            post,
            userReaction,
            savedPost,
            onClickReactButton,
            onClickCommentsButton,
            onClickSavePostButton,
            likesNumber,
            optionsDisabled
          ) }

          <PostData
            producer={ post.producer }
            actor={ post.actor }
            postActors={ post.actors }
            postTags={ post.tags }
            postDescription={ post.description }
            date={ post.formattedPublishedAt }
            viewsNumber={ viewsNumber }
          />
        </div>

        <div className={ styles.post__rightContainer }>
          <span className={ styles.post__rightContainerItem }>
          </span>
          <span className={ styles.post__rightContainerItemHiddenMobile }>
            <TrafficstarsDesktopBanner />
          </span>
          <span className={ styles.post__rightContainerItemHiddenMobile }>
          </span>
        </div>
      </section>
      <div ref={ commentsRef }/>
      { commentsComponent }
    </div>
  )
}
