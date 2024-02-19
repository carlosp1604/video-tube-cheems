import styles from './Post.module.scss'
import { FC, ReactElement, useEffect, useRef, useState } from 'react'
import { PostComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostComponentDto'
import { ReactionComponentDto } from '~/modules/Reactions/Infrastructure/Components/ReactionComponentDto'
import {
  ReactionComponentDtoTranslator
} from '~/modules/Reactions/Infrastructure/Components/ReactionComponentDtoTranslator'
import { PostsApiService } from '~/modules/Posts/Infrastructure/Frontend/PostsApiService'
import { PostComments } from '~/modules/Posts/Infrastructure/Components/PostComment/PostComments'
import { useSession } from 'next-auth/react'
import { ReactionType } from '~/modules/Reactions/Infrastructure/ReactionType'
import { Promise } from 'es6-promise'
import { PostTypeResolver } from '~/modules/Posts/Infrastructure/Components/Post/PostTypes/PostTypeResolver'
import { PostBasicData } from '~/modules/Posts/Infrastructure/Components/Post/PostData/PostBasicData'
import { useSavePost } from '~/hooks/SavePosts'
import { useReactPost } from '~/hooks/ReactPost'
import { PostData } from '~/modules/Posts/Infrastructure/Components/Post/PostData/PostData'

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
          if (response.ok) {
            setViewsNumber(viewsNumber + 1)
          }
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

    if (!currentValue) {
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
            optionsDisabled,
            <PostBasicData
              post={ post }
              postViewsNumber={ viewsNumber }
              postLikes={ likesNumber }
              postDislikes={ dislikesNumber }
              postCommentsNumber={ commentsNumber }
            />
          ) }

          <PostData
            producer={ post.producer }
            actor={ post.actor }
            postActors={ post.actors }
            postTags={ post.tags }
            postDescription={ post.description }
          />
        </div>

        { /** TODO: Set max-width or max-height
        <div className={ styles.post__rightContainer }>
          <span className={ styles.post__adverstisingTitle }>
            { t('advertising_section_title') }
          </span>
          Add here
        </div>
        **/ }
      </section>

      <div ref={ commentsRef }>
        { commentsComponent }
      </div>
    </div>
  )
}
