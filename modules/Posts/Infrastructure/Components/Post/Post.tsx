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
import { AdsterraBanner } from '~/modules/Shared/Infrastructure/Components/Advertising/AdsterraBanner/AdsterraBanner'
import { DesktopBanner } from '~/modules/Shared/Infrastructure/Components/Advertising/Exoclick/DesktopBanner'
import { OutstreamBanner } from '~/modules/Shared/Infrastructure/Components/Advertising/Exoclick/OutstreamBanner'
import dynamic from 'next/dynamic'
import { useSavePost } from '~/hooks/SavePosts'
import { useMediaQuery } from '~/hooks/MediaQuery'

const PostComments = dynamic(() =>
  import('~/modules/Posts/Infrastructure/Components/PostComment/PostComments').then((module) => module.PostComments),
{ ssr: false }
)

export interface Props {
  post: PostComponentDto
  postViewsNumber: number
  postLikes: number
  postDislikes: number
  postCommentsNumber: number
}

export const Post: FC<Props> = ({
  post,
  postViewsNumber,
  postLikes,
  postDislikes,
  postCommentsNumber,
}) => {
  const [likesNumber, setLikesNumber] = useState<number>(postLikes)
  const [dislikesNumber, setDislikesNumber] = useState<number>(postDislikes)
  const [viewsNumber, setViewsNumber] = useState<number>(postViewsNumber)
  const [userReaction, setUserReaction] = useState<ReactionComponentDto | null>(null)
  const [commentsOpen, setCommentsOpen] = useState<boolean>(false)
  const [commentsNumber, setCommentsNumber] = useState<number>(postCommentsNumber)
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
        .then(async (response) => {
          if (response.ok) {
            const jsonResponse = await response.json()

            setSavedPost(jsonResponse.savedPost)

            if (jsonResponse.userReaction === null) {
              setUserReaction(null)

              return
            }

            const userReactionDto =
              ReactionComponentDtoTranslator.fromApplicationDto(jsonResponse.userReaction)

            setUserReaction(userReactionDto)
          } else {
            const jsonResponse = await response.json()

            console.error(jsonResponse)
          }
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
  }, [status])

  useEffect(() => {
    try {
      postsApiService.addPostView(post.id)
        .then((response) => {
          setViewsNumber(response.postViews)
        })
    } catch (exception: unknown) {
      console.error(exception)
    }
  }, [])

  let commentsComponent: ReactElement | null = null

  if (commentsOpen) {
    commentsComponent = (
      <PostComments
        key={ post.id }
        postId={ post.id }
        setIsOpen={ setCommentsOpen }
        setCommentsNumber={ setCommentsNumber }
        commentsNumber={ commentsNumber }
      />
    )
  }

  const onClickCommentsButton = () => {
    const currentValue = commentsOpen

    setCommentsOpen(!commentsOpen)

    if (!currentValue && (
      activeBreakpoint !== 'default' && activeBreakpoint !== 'sm' && activeBreakpoint !== 'tb')
    ) {
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
            <AdsterraBanner />
          </span>
          <span className={ styles.post__rightContainerItemHiddenMobile }>
            <OutstreamBanner />
          </span>
          <span className={ styles.post__rightContainerItemHiddenMd }>
            <DesktopBanner />
          </span>
        </div>
      </section>
      <div ref={ commentsRef } />
      { commentsComponent }
    </div>
  )
}
