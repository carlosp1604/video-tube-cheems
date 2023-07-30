import styles from './Video.module.scss'
import { FC, ReactElement, useState } from 'react'
import {
  BsArrowUpRight,
  BsBookmarks,
  BsChatSquareText,
  BsCursor,
  BsDownload,
  BsHeart,
  BsMegaphone
} from 'react-icons/bs'
import { PostComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostComponentDto'
import { VideoPlayer } from '~/components/VideoPlayer/VideoPlayer'
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

export interface Props {
  post: PostComponentDto
}

export const Video: FC<Props> = ({ post }) => {
  const [reactionsNumber, setReactionsNumber] = useState<number>(post.reactions)
  const [viewsNumber, setViewsNumber] = useState<number>(post.views)
  const [descriptionOpen, setDescriptionOpen] = useState<boolean>(false)
  const [producerOpen, setProducerOpen] = useState<boolean>(false)
  const [userReaction, setUserReaction] = useState<PostReactionComponentDto | null>(post.userReaction)
  const [commentsOpen, setCommentsOpen] = useState<boolean>(false)
  const [commentsNumber, setCommentsNumber] = useState<number>(post.comments)

  const { t } = useTranslation('video')
  const { setLoginModalOpen } = useLoginContext()
  const postsApiService = new PostsApiService()

  const { status } = useSession()

  let producerSection: ReactElement | null = null
  let actorsSection: ReactElement[] | null = null

  if (post.producer !== null) {
    producerSection = (
      <div className={ styles.video__producerItem }>
        <Image
          alt={ post.producer.name }
          className={ styles.video__producerLogo }
          src={ post.producer.imageUrl }
          width={ 0 }
          height={ 0 }
          sizes={ '100vw' }
        />
        <span className={ styles.video__producerName }>
          { post.producer.name }
          <a
            href={ '/' }
            className={ styles.video__profile }>
            { t('actors_producer_profile_button_title') }
            <BsArrowUpRight />
          </a>
        </span>
      </div>
    )
  }

  if (post.actors.length > 0) {
    actorsSection = post.actors.map((actor) => {
      return (
        <div
          className={ styles.video__actorsItem }
          key={ actor.id }
        >
          <Image
            className={ styles.video__actorLogo }
            src={ actor.imageUrl }
            alt={ actor.name }
            width={ 0 }
            height={ 0 }
            sizes={ '100vw' }
          />
          <span className={ styles.video__actorName }>
          { actor.name }
            <a
              href={ `/actors/${actor.id}` }
              className={ styles.video__profile }
            >
              { t('actors_producer_profile_button_title') }
              <BsArrowUpRight />
            </a>
          </span>
        </div>
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
        }
      } catch (exception: unknown) {
        console.error(exception)
        toast.error(t('server_error_error_message'))
      }
    }
  }

  return (
    <div className={ styles.video__container }>
      <div className={ styles.video__videoContainer } >
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

      <div className={ styles.video__videoData } key={ post.id }>
        <h1 className={ styles.video__videoTitle }>
          { post.title }
        </h1>
        <div className={ styles.video__videoInfo }>
          <span className={ styles.video__videoInfoItem }>
            { post.date }
          </span>
          <span className={ styles.video__videoInfoItem }>
            { t('video_views_title', { views: viewsNumber }) }
          </span>
          <span className={ styles.video__videoInfoItem }>
            { reactionsNumber } <BsHeart />
          </span>
          <span className={ styles.video__videoInfoItem }>
            { commentsNumber } <BsChatSquareText />
          </span>
        </div>

        <div className={ styles.video__videoOptions }>
          <span className={ `
            ${styles.video__videoOptionIcon}
            ${userReaction !== null ? styles.video__videoOptionIcon_userReacted : ''}
          ` }
            onClick={ onClickReactButton }
          >
            <BsHeart className={ styles.video__heartIcon }/>
          </span>
          <span
            className={ styles.video__videoOptionIcon }
            onClick={ () => setCommentsOpen(!commentsOpen) }
          >
            <BsChatSquareText className={ styles.video__commentIcon }/>
          </span>
          <span className={ styles.video__videoOptionIcon }>
            <BsCursor className={ styles.video__shareIcon }/>
          </span>
          <span className={ styles.video__videoOptionIcon }>
            <BsBookmarks className={ styles.video__saveIcon }/>
          </span>
          <span className={ styles.video__videoOptionIcon }>
            <BsDownload className={ styles.video__downloadIcon }/>
          </span>
          <span className={ styles.video__videoOptionIcon }>
            <BsMegaphone className={ styles.video__reportIcon }/>
          </span>
        </div>

        <div className={ `
          ${styles.video__videoActorTagsCat}
          ${producerOpen ? styles.video__videoActorTagsCat__open : ''}
        ` }
             onClick={ () => setProducerOpen(!producerOpen) }
        >
          <div className={ styles.video__dataItem }>
            { post.producer !== null ? t('video_description_producer_title') : '' }
            { producerSection }
          </div>

          <div className={ styles.video__dataItem }>
            { post.actors.length > 0 ? t('video_description_actors_title') : '' }
            { actorsSection }
          </div>

          <div className={ styles.video__dataItem }>
            { post.tags.length > 0 ? t('video_description_tags_title') : '' }
            <TagList tags={ post.tags } />
          </div>

          <div className={ styles.video__videoActorTagsCatShowMore }>
            <button
              className={ styles.video__videoActorTagsShowMoreButton }
              onClick={ () => setProducerOpen(!producerOpen) }
            >
              { producerOpen
                ? t('video_actors_producer_section_hide')
                : t('video_actors_producer_section_show_more') }
            </button>
          </div>
        </div>

        <div className={ `
          ${styles.video__videoDescription}
          ${descriptionOpen ? styles.video__videoDescription__open : ''}
        ` }
         onClick={ () => setDescriptionOpen(!descriptionOpen) }
        >
          { post.description }
          <span className={ styles.video__videoDescriptionShowMore }>
            <button
              className={ styles.video__videoDescriptionShowMoreButton }
              onClick={ () => setDescriptionOpen(!descriptionOpen) }
            >
              { descriptionOpen ? t('video_description_hide') : t('video_description_show_more') }
            </button>
          </span>
        </div>
      </div>
      { commentsComponent }
    </div>
  )
}
