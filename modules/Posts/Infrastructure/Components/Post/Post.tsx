import styles from './Post.module.scss'
import { FC, ReactElement, useEffect, useMemo, useRef, useState } from 'react'
import { PostComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostComponentDto'
import { useTranslation } from 'next-i18next'
import { ReactionComponentDto } from '~/modules/Reactions/Infrastructure/Components/ReactionComponentDto'
import {
  ReactionComponentDtoTranslator
} from '~/modules/Reactions/Infrastructure/Components/ReactionComponentDtoTranslator'
import { PostsApiService } from '~/modules/Posts/Infrastructure/Frontend/PostsApiService'
import { PostComments } from '~/modules/Posts/Infrastructure/Components/PostComment/PostComments'
import toast from 'react-hot-toast'
import { useLoginContext } from '~/hooks/LoginContext'
import { signOut, useSession } from 'next-auth/react'
import { POST_REACTION_USER_NOT_FOUND } from '~/modules/Posts/Infrastructure/Api/PostApiExceptionCodes'
import { ReactionType } from '~/modules/Reactions/Infrastructure/ReactionType'
import { Promise } from 'es6-promise'
import { PostExtraData } from '~/modules/Posts/Infrastructure/Components/Post/PostExtraData/PostExtraData'
import { PostTypeResolver } from '~/modules/Posts/Infrastructure/Components/Post/PostTypes/PostTypeResolver'
import { PostBasicData } from '~/modules/Posts/Infrastructure/Components/Post/PostData/PostBasicData'
import { PostOptions } from '~/modules/Posts/Infrastructure/Components/Post/PostOptions/PostOptions'
import { MediaUrlComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostMedia/MediaUrlComponentDto'
import { PostProducerActor } from '~/modules/Posts/Infrastructure/Components/Post/PostProducerActor/PostProducerActor'
import {
  USER_SAVED_POSTS_POST_ALREADY_ADDED,
  USER_SAVED_POSTS_POST_DOES_NOT_EXISTS_ON_SAVED_POSTS,
  USER_USER_NOT_FOUND
} from '~/modules/Auth/Infrastructure/Api/AuthApiExceptionCodes'
import { APIException } from '~/modules/Shared/Infrastructure/FrontEnd/ApiException'

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

  const { t } = useTranslation('post')
  const { setLoginModalOpen } = useLoginContext()
  const postsApiService = new PostsApiService()
  const commentsRef = useRef<HTMLDivElement>(null)

  const { status, data } = useSession()

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

  useEffect(() => {
    if (status === 'unauthenticated') {
      setUserReaction(null)
    }

    if (status === 'authenticated') {
      postsApiService.getPostUserInteraction(post.id)
        .then(async (response) => {
          if (response.ok) {
            const jsonResponse = await response.json()

            setSavedPost(jsonResponse.savedPost)

            if (jsonResponse === null) {
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

  const onClickReactButton = async (type: ReactionType) => {
    if (status !== 'authenticated') {
      toast.error(t('user_must_be_authenticated_error_message'))

      return
    }

    if (userReaction !== null && userReaction.reactionType === type) {
      try {
        await postsApiService.deletePostReaction(post.id)

        setUserReaction(null)
        if (type === ReactionType.LIKE) {
          setLikesNumber(likesNumber - 1)
        } else {
          setDislikesNumber(dislikesNumber - 1)
        }

        toast.success(t('post_reaction_deleted_correctly_message'))
      } catch (exception: unknown) {
        if (!(exception instanceof APIException)) {
          console.error(exception)

          return
        }

        if (exception.code === POST_REACTION_USER_NOT_FOUND) {
          await signOut({ redirect: false })
        }

        if (exception.apiCode === 401) {
          setLoginModalOpen(true)
        }

        toast.error(t(exception.translationKey))
      }
    } else {
      try {
        const reaction = await postsApiService.createPostReaction(post.id, type)
        const reactionComponentDto = ReactionComponentDtoTranslator.fromApplicationDto(reaction)

        if (reactionComponentDto.reactionType === ReactionType.LIKE) {
          if (userReaction !== null && userReaction.reactionType === ReactionType.DISLIKE) {
            setDislikesNumber(dislikesNumber - 1)
          }
          setLikesNumber(likesNumber + 1)
        } else {
          if (userReaction !== null && userReaction.reactionType === ReactionType.LIKE) {
            setLikesNumber(likesNumber - 1)
          }
          setDislikesNumber(dislikesNumber + 1)
        }

        setUserReaction(reactionComponentDto)

        toast.success(t('post_reaction_added_correctly_message'))
      } catch (exception: unknown) {
        if (!(exception instanceof APIException)) {
          console.error(exception)

          return
        }

        if (exception.code === POST_REACTION_USER_NOT_FOUND) {
          await signOut({ redirect: false })
        }

        if (exception.apiCode === 401) {
          setLoginModalOpen(true)
        }

        toast.error(t(exception.translationKey))
      }
    }
  }

  const onClickSavePostButton = async () => {
    if (status !== 'authenticated') {
      toast.error(t('user_must_be_authenticated_error_message'))

      return
    }

    if (savedPost && data) {
      try {
        await postsApiService.removeFromSavedPosts(data.user.id, post.id)
        setSavedPost(false)
        toast.success(t('post_save_post_successfully_removed_from_saved_post'))
      } catch (exception: unknown) {
        if (!(exception instanceof APIException)) {
          console.error(exception)

          return
        }

        if (exception.code === USER_USER_NOT_FOUND) {
          await signOut({ redirect: false })
        }

        if (exception.code === USER_SAVED_POSTS_POST_DOES_NOT_EXISTS_ON_SAVED_POSTS) {
          setSavedPost(false)
        }

        toast.error(t(exception.translationKey))
      }
    }

    if (!savedPost && data) {
      try {
        await postsApiService.savePost(data.user.id, post.id)
        setSavedPost(true)
        toast.success(t('post_save_post_successfully_saved'))
      } catch (exception: unknown) {
        if (!(exception instanceof APIException)) {
          console.error(exception)

          return
        }

        if (exception.code === USER_SAVED_POSTS_POST_ALREADY_ADDED) {
          setSavedPost(true)
        }

        if (exception.code === USER_USER_NOT_FOUND) {
          await signOut({ redirect: false })
        }

        toast.error(t(exception.translationKey))
      }
    }
  }

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
    if (!commentsOpen) {
      commentsRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
    setCommentsOpen(!commentsOpen)
  }

  return (
    <div className={ styles.post__container }>
      { PostTypeResolver.resolve(
        post,
        mediaUrls,
        <PostBasicData
          post={ post }
          postViewsNumber={ viewsNumber }
          postLikes={ likesNumber }
          postDislikes={ dislikesNumber }
          postCommentsNumber={ commentsNumber }
        />,
        <PostOptions
          userReaction={ userReaction }
          savedPost={ savedPost }
          onClickReactButton={ (type) => onClickReactButton(type) }
          onClickCommentsButton={ onClickCommentsButton }
          onClickSaveButton={ onClickSavePostButton }
          likesNumber={ likesNumber }
          mediaUrls={ mediaUrls }
      />
      ) }

      <PostProducerActor
        producer={ post.producer }
        actor={ post.actor }
      />

      <PostExtraData
        postActors={ post.actors }
        postTags={ post.tags }
        postDescription={ post.description }
      />

      <div ref={ commentsRef }>
        { commentsComponent }
      </div>
    </div>
  )
}
