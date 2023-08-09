import styles from './Post.module.scss'
import { FC, ReactElement, useEffect, useState } from 'react'
import {
  BsBookmarks, BsCaretDown,
  BsChatSquareText,
  BsDownload,
  BsHeart,
  BsMegaphone
} from 'react-icons/bs'
import { PostComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostComponentDto'
import { TagList } from '~/modules/Posts/Infrastructure/Components/TagList/TagList'
import { useTranslation } from 'next-i18next'
import { PostReactionComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostReactionComponentDto'
import {
  PostReactionComponentDtoTranslator
} from '~/modules/Posts/Infrastructure/Translators/PostReactionComponentDtoTranslator'
import { PostsApiService } from '~/modules/Posts/Infrastructure/Frontend/PostsApiService'
import { Reaction } from '~/modules/Posts/Domain/PostReaction'
import { PostComments } from '~/modules/Posts/Infrastructure/Components/PostComment/PostComments'
import Image from 'next/image'
import toast from 'react-hot-toast'
import { useLoginContext } from '~/hooks/LoginContext'
import { useSession } from 'next-auth/react'
import {
  POST_REACTION_NOT_FOUND,
  POST_REACTION_POST_NOT_FOUND
} from '~/modules/Posts/Infrastructure/PostApiExceptionCodes'
import Link from 'next/link'
import Avatar from 'react-avatar'
import { VideoPlayer } from '~/components/VideoPlayer/VideoPlayer'

export interface Props {
  post: PostComponentDto
}

export const Post: FC<Props> = ({ post }) => {
  const [reactionsNumber, setReactionsNumber] = useState<number>(post.reactions)
  const [viewsNumber, setViewsNumber] = useState<number>(post.views)
  const [extraDataOpen, setExtraDataOpen] = useState<boolean>(false)
  const [userReaction, setUserReaction] = useState<PostReactionComponentDto | null>(null)
  const [commentsOpen, setCommentsOpen] = useState<boolean>(false)
  const [commentsNumber, setCommentsNumber] = useState<number>(post.comments)

  const { t } = useTranslation('post')
  const { setLoginModalOpen } = useLoginContext()
  const postsApiService = new PostsApiService()

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

            const userReactionDto = PostReactionComponentDtoTranslator.fromApplicationDto(jsonResponse)

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
  }, [status])

  let producerSection: ReactElement | null = null
  let actorsSection: ReactElement[] | null = null

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

  if (post.actors.length > 0) {
    actorsSection = post.actors.map((actor) => {
      let avatarSection: ReactElement

      if (actor.imageUrl !== null) {
        avatarSection = (
          <Image
            className={ styles.post__actorLogo }
            src={ actor.imageUrl }
            alt={ actor.name }
            width={ 0 }
            height={ 0 }
            sizes={ '100vw' }
          />
        )
      } else {
        avatarSection = (
          <Avatar
            round={ true }
            size={ '40' }
            name={ actor.name }
          />
        )
      }

      return (
        <Link
          href={ '/' }
          className={ styles.post__actorsItemLink }
          key={ actor.id }
        >
          { avatarSection }
          { actor.name }
        </Link>
      )
    })
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

  const onClickReactButton = async () => {
    if (status !== 'authenticated') {
      toast.error(t('user_must_be_authenticated_error_message'))

      return
    }

    if (userReaction !== null) {
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
          setReactionsNumber(reactionsNumber - 1)
          toast.success(t('post_reaction_deleted_correctly_message'))
        }
      } catch (exception: unknown) {
        console.error(exception)
        toast.error(t('server_error_error_message'))
      }
    } else {
      try {
        // FIXME: ReactionType
        const response = await postsApiService.createPostReaction(post.id, Reaction.LIKE)

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
          const userReaction = await response.json()

          setUserReaction(PostReactionComponentDtoTranslator.fromApplicationDto(userReaction))
          setReactionsNumber(reactionsNumber + 1)
          toast.success(t('post_reaction_added_correctly_message'))
        }
      } catch (exception: unknown) {
        console.error(exception)
        toast.error(t('server_error_error_message'))
      }
    }
  }

  return (
    <div className={ styles.post__container }>
      <div className={ styles.post__videoContainer } >
        <VideoPlayer
          key={ post.id }
          videoQualities={ post.video.qualities }
          videoPoster={ post.video.poster }
          videoId={ post.id }
          onVideoPlay={ () => {
            setViewsNumber(viewsNumber + 1)
          } }
        />

      </div>

      <div className={ styles.post__postData } key={ post.id }>
        <h1 className={ styles.post__postTitle }>
          { post.title }
        </h1>
        <div className={ styles.post__postInfo }>
          <span className={ styles.post__postInfoItem }>
            { post.date }
          </span>
          <span className={ styles.post__postInfoItem }>
            { t('post_views_title', { views: viewsNumber }) }
          </span>
          <span className={ styles.post__postInfoItem }>
            { reactionsNumber } <BsHeart />
          </span>
          <span className={ styles.post__postInfoItem }>
            { commentsNumber } <BsChatSquareText />
          </span>
        </div>

        <div className={ styles.post__optionsContainer }>
          <span
            className={ `
              ${styles.post__optionItem}
              ${userReaction !== null ? styles.post__optionItem_active : ''}
            ` }
            onClick={ onClickReactButton }
          >
            <BsHeart className={ styles.post__optionItemIcon }/>
            { t('post_like_button_title') }
          </span>
          <span
            className={ styles.post__optionItem }
            onClick={ () => setCommentsOpen(!commentsOpen) }
          >
            <BsChatSquareText className={ styles.post__optionItemIcon }/>
            { t('post_comments_button_title') }
          </span>
          {
            /**
            <span className={ styles.post__optionItem }>
              <BsCursor className={ styles.post__optionItemIcon }/>
              Compartir
            </span>
            **/
          }
          <span className={ styles.post__optionItem }>
            <BsBookmarks className={ styles.post__optionItemIcon }/>
            { t('post_save_button_title') }
          </span>
          <span className={ styles.post__optionItem }>
            <BsDownload className={ styles.post__optionItemIcon }/>
            { t('post_download_button_title') }
          </span>
          <span className={ styles.post__optionItem }>
            <BsMegaphone className={ styles.post__optionItemIcon }/>
            { t('post_report_button_title') }
          </span>
        </div>

        { producerSection }

        <div className={ `
          ${styles.post__postExtraData}
          ${extraDataOpen ? styles.post__postExtraData__open : ''}
        ` }
        >
          {
            post.actors.length > 0
              ? <div className={ styles.post__dataItem }>
                  { t('post_extra_data_actors_title') }
                  <div className={ styles.post__actorsContainer }>
                    { actorsSection }
                  </div>
                </div>
              : null
          }

          { post.tags.length > 0
            ? <div className={ styles.post__dataItem }>
                { t('post_extra_data_tags_title') }
                <TagList tags={ post.tags } />
              </div>
            : null
          }

          {
            post.description !== ''
              ? <div className={ styles.post__dataItem }>
                  { t('post_extra_data_description_title') }
                  <span className={ styles.post__postDescription }>
                    { post.description }
                  </span>
                </div>
              : null
          }

        </div>

        <div
          className={ `
            ${styles.post__extraDataButton}
            ${extraDataOpen ? styles.post__extraDataButton_open : ''}
          ` }
          onClick={ () => setExtraDataOpen(!extraDataOpen) }
        >
          { extraDataOpen
            ? t('post_extra_data_section_hide')
            : t('post_extra_data_section_show_more')
          }
          <BsCaretDown className={ `
            ${styles.post__extraDataIcon}
            ${extraDataOpen ? styles.post__extraDataIcon_open : ''}
          ` }/>
        </div>
      </div>
      { commentsComponent }
    </div>
  )
}
