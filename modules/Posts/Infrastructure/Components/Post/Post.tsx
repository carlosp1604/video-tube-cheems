import styles from './Post.module.scss'
import { FC, ReactElement, useEffect, useRef, useState } from 'react'
import { PostComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostComponentDto'
import { useTranslation } from 'next-i18next'
import { ReactionComponentDto } from '~/modules/Reactions/Infrastructure/Components/ReactionComponentDto'
import {
  ReactionComponentDtoTranslator
} from '~/modules/Reactions/Infrastructure/Components/ReactionComponentDtoTranslator'
import { PostsApiService } from '~/modules/Posts/Infrastructure/Frontend/PostsApiService'
import { PostComments } from '~/modules/Posts/Infrastructure/Components/PostComment/PostComments'
import Image from 'next/image'
import toast from 'react-hot-toast'
import { useLoginContext } from '~/hooks/LoginContext'
import { useSession } from 'next-auth/react'
import {
  POST_REACTION_NOT_FOUND,
  POST_REACTION_POST_NOT_FOUND
} from '~/modules/Posts/Infrastructure/Api/PostApiExceptionCodes'
import Link from 'next/link'
import Avatar from 'react-avatar'
import { BsX } from 'react-icons/bs'
import { ReactionType } from '~/modules/Reactions/Infrastructure/ReactionType'
import { Promise } from 'es6-promise'
import { PostExtraData } from '~/modules/Posts/Infrastructure/Components/Post/PostExtraData/PostExtraData'
import { PostTypeResolver } from '~/modules/Posts/Infrastructure/Components/Post/PostTypes/PostTypeResolver'

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

  const { t } = useTranslation('post')
  const { setLoginModalOpen } = useLoginContext()
  const postsApiService = new PostsApiService()
  const commentsRef = useRef<HTMLDivElement>(null)

  const { status } = useSession()

  useEffect(() => {
    if (status === 'unauthenticated') {
      setUserReaction(null)
    }

    if (status === 'authenticated') {
      postsApiService.getPostUserInteraction(post.id)
        .then(async (response) => {
          if (response.ok) {
            const jsonResponse = await response.json()

            if (jsonResponse === null) {
              setUserReaction(null)

              return
            }

            const userReactionDto = ReactionComponentDtoTranslator.fromApplicationDto(jsonResponse)

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
        const response = await postsApiService.deletePostReaction(post.id)

        if (!response.ok) {
          switch (response.status) {
            case 400:
              toast.error(t('bad_request_error_message'))
              break

            case 404: {
              const jsonResponse = await response.json()

              switch (jsonResponse.code) {
                case POST_REACTION_POST_NOT_FOUND:
                  toast.error(t('post_does_not_exist_error_message'))
                  break

                case POST_REACTION_NOT_FOUND:
                  toast.error(t('post_reaction_does_not_exist'))
                  break

                default:
                  toast.error(t('server_error_error_message'))
                  break
              }
              break
            }

            default:
              toast.error(t('server_error_error_message'))
              break
          }
        } else {
          setUserReaction(null)
          if (type === ReactionType.LIKE) {
            setLikesNumber(likesNumber - 1)
          } else {
            setDislikesNumber(dislikesNumber - 1)
          }
          toast.success(t('post_reaction_deleted_correctly_message'))
        }
      } catch (exception: unknown) {
        console.error(exception)
        toast.error(t('server_error_error_message'))
      }
    } else {
      try {
        const response = await postsApiService.createPostReaction(post.id, type)

        if (!response.ok) {
          switch (response.status) {
            case 400:
              toast.error(t('bad_request_error_message'))
              break

            case 401:
              setLoginModalOpen(true)
              toast.error(t('user_must_be_authenticated_error_message'))
              break

            case 404:
              toast.error(t('post_does_not_exist_error_message'))
              break

            case 409:
              toast.error(t('user_already_reacted_to_post_error_message'))
              break

            default:
              toast.error(t('server_error_error_message'))
              break
          }
        } else {
          const reaction = await response.json()

          if (type === ReactionType.LIKE) {
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

          setUserReaction(ReactionComponentDtoTranslator.fromApplicationDto(reaction))

          toast.success(t('post_reaction_added_correctly_message'))
        }
      } catch (exception: unknown) {
        console.error(exception)
        toast.error(t('server_error_error_message'))
      }
    }
  }

  let producerSection: ReactElement | null = null
  let actorSection: ReactElement | null = null

  if (post.producer !== null) {
    let producerAvatarSection: ReactElement

    if (post.producer.imageUrl !== null) {
      producerAvatarSection = (
        <Image
          alt={ post.producer.name }
          className={ styles.post__producerLogo }
          src={ post.producer.imageUrl }
          width={ 0 }
          height={ 0 }
          sizes={ '100vw' }
        />
      )
    } else {
      producerAvatarSection = (
        <Avatar
          round={ true }
          size={ '40' }
          name={ post.producer.name }
        />
      )
    }
    producerSection = (
      <Link
        href={ '/' }
        className={ styles.post__producerItem }
        title={ post.producer.name }
      >
        { producerAvatarSection }
        { post.producer.name }
      </Link>
    )
  }

  if (post.actor !== null) {
    let actorAvatarSection: ReactElement

    if (post.actor.imageUrl !== null) {
      actorAvatarSection = (
        <Image
          alt={ post.actor.name }
          className={ styles.post__producerLogo }
          src={ post.actor.imageUrl }
          width={ 0 }
          height={ 0 }
          sizes={ '100vw' }
        />
      )
    } else {
      actorAvatarSection = (
        <Avatar
          round={ true }
          size={ '40' }
          name={ post.actor.name }
        />
      )
    }
    actorSection = (
      <Link
        href={ '/' }
        className={ styles.post__producerItem }
        title={ post.actor.name }
      >
        { actorAvatarSection }
        { post.actor.name }
      </Link>
    )
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

  return (
    <div className={ styles.post__container }>
      { PostTypeResolver.resolve(
        post,
        viewsNumber,
        likesNumber,
        dislikesNumber,
        commentsNumber,
        userReaction,
        (reactionType) => onClickReactButton(reactionType),
        () => {
          if (!commentsOpen) {
            commentsRef.current?.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            })
          }
          setCommentsOpen(!commentsOpen)
        }
      ) }

      <div className={ styles.post__producersContainer }>
        { producerSection }
        { producerSection && actorSection
          ? <BsX className={ styles.post__producersIcon }/>
          : null
        }
        { actorSection }
      </div>

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
