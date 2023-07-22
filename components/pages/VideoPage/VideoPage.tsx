import { NextPage } from 'next'
import styles from './VideoPage.module.scss'
import { ReactElement, useState } from 'react'
import { BsArrowUpRight, BsBookmarks, BsChatSquareText, BsCursor, BsDownload, BsHeart, BsMegaphone } from 'react-icons/bs'
import { PostComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostComponentDto'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import { VideoPlayer } from '~/components/VideoPlayer/VideoPlayer'
import { PostCardCarousel } from '~/modules/Posts/Infrastructure/Components/PostCardCarrousel/PostCardCarousel'
import { PostComments } from '~/modules/Posts/Infrastructure/Components/PostComment/PostComments'
import { TagList } from '~/modules/Posts/Infrastructure/Components/TagList/TagList'
import { useTranslation } from 'next-i18next'
import { PostReactionComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostReactionComponentDto'
import {
  PostReactionComponentDtoTranslator
} from '~/modules/Posts/Infrastructure/Translators/PostReactionComponentDtoTranslator'
import { PostsApiService } from '~/modules/Posts/Infrastructure/Frontend/PostsApiService'
import { Reaction } from '~/modules/Posts/Domain/PostReaction'

export interface VideoPageProps {
  post: PostComponentDto
  relatedPosts: PostCardComponentDto[]
}

export const VideoPage: NextPage<VideoPageProps> = ({ post, relatedPosts }) => {
  const [reactionsNumber, setReactionsNumber] = useState<number>(post.reactions)
  const [viewsNumber, setViewsNumber] = useState<number>(post.views)
  const [commentsNumber, setCommentsNumber] = useState<number>(post.comments)
  const [descriptionOpen, setDescriptionOpen] = useState<boolean>(false)
  const [producerOpen, setProducerOpen] = useState<boolean>(false)
  const [commentsOpen, setCommentsOpen] = useState<boolean>(false)
  const [userReaction, setUserReaction] = useState<PostReactionComponentDto | null>(post.userReaction)

  const { t } = useTranslation('video_page')
  const postsApiService = new PostsApiService()

  let producerSection: ReactElement | string = ''
  let actorsSection: ReactElement[] | string = ''

  if (post.producer !== null) {
    producerSection = (
      <div className={ styles.videoPage__producerItem }>
        <img
          alt={ post.producer.name }
          className={ styles.videoPage__producerLogo }
          src={ post.producer.imageUrl }
        />
        <span className={ styles.videoPage__producerName }>
          { post.producer.name }
          <a
            href={ '/' }
            className={ styles.videoPage__profile }>
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
          className={ styles.videoPage__actorsItem }
          key={ actor.id }
        >
          <img
            className={ styles.videoPage__actorLogo }
            src={ actor.imageUrl }
            alt={ actor.name }
          />
          <span className={ styles.videoPage__actorName }>
          { actor.name }
            <a
              href={ `/actors/${actor.id}` }
              className={ styles.videoPage__profile }
            >
              { t('actors_producer_profile_button_title') }
              <BsArrowUpRight />
            </a>
          </span>
        </div>
      )
    })
  }

  const onClickReactButton = async () => {
    if (userReaction !== null) {
      try {
        await postsApiService.deletePostReaction(post.id)
        setUserReaction(null)
        setReactionsNumber(reactionsNumber - 1)
      } catch (exception: unknown) {
        console.error(exception)
      }
    } else {
      try {
        // FIXME: ReactionType
        const response = await postsApiService.createPostReaction(post.id, Reaction.LIKE)

        const userReaction = await response.json()

        setUserReaction(PostReactionComponentDtoTranslator.fromApplicationDto(userReaction))
        setReactionsNumber(reactionsNumber + 1)
      } catch (exception: unknown) {
        console.error(exception)
      }
    }
  }

  return (
    <div className={ styles.videoPage__container }>
      <div className={ styles.videoPage__videoContainer } >
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

      <div className={ styles.videoPage__videoData } key={ post.id }>
        <h1 className={ styles.videoPage__videoTitle }>
          { post.title }
        </h1>
        <div className={ styles.videoPage__videoInfo }>
          <span className={ styles.videoPage__videoInfoItem }>
            { post.date }
          </span>
          <span className={ styles.videoPage__videoInfoItem }>
            { t('video_views_title', { views: viewsNumber }) }
          </span>
          <span className={ styles.videoPage__videoInfoItem }>
            { reactionsNumber } <BsHeart />
          </span>
          <span className={ styles.videoPage__videoInfoItem }>
            { commentsNumber } <BsChatSquareText />
          </span>
        </div>

        <div className={ styles.videoPage__videoOptions }>
          <span className={ `
            ${styles.videoPage__videoOptionIcon}
            ${userReaction !== null ? styles.videoPage__videoOptionIcon_userReacted : ''}
          ` }
            onClick={ onClickReactButton }
          >
            <BsHeart className={ styles.videoPage__heartIcon }/>
          </span>
          <span
            className={ styles.videoPage__videoOptionIcon }
            onClick={ () => setCommentsOpen(!commentsOpen) }
          >
          <BsChatSquareText className={ styles.videoPage__commentIcon }/>
          </span>
          <span className={ styles.videoPage__videoOptionIcon }>
            <BsCursor className={ styles.videoPage__shareIcon }/>
          </span>
          <span className={ styles.videoPage__videoOptionIcon }>
            <BsBookmarks className={ styles.videoPage__saveIcon }/>
          </span>
          <span className={ styles.videoPage__videoOptionIcon }>
            <BsDownload className={ styles.videoPage__downloadIcon }/>
          </span>
          <span className={ styles.videoPage__videoOptionIcon }>
            <BsMegaphone className={ styles.videoPage__reportIcon }/>
          </span>
        </div>

        <div className={ `
          ${styles.videoPage__videoActorTagsCat}
          ${producerOpen ? styles.videoPage__videoActorTagsCat__open : ''}
        ` }
        onClick={ () => setProducerOpen(!producerOpen) }
        >
          <div className={ styles.videoPage__dataItem }>
            { post.producer !== null ? t('video_description_producer_title') : '' }
            { producerSection }
          </div>

          <div className={ styles.videoPage__dataItem }>
            { post.actors.length > 0 ? t('video_description_actors_title') : '' }
            { actorsSection }
          </div>

          <div className={ styles.videoPage__dataItem }>
            { post.tags.length > 0 ? t('video_description_tags_title') : '' }
            <TagList tags={ post.tags } />
          </div>

          <div className={ styles.videoPage__videoActorTagsCatShowMore }>
            <button
              className={ styles.videoPage__videoActorTagsShowMoreButton }
              onClick={ () => setProducerOpen(!producerOpen) }
            >
              { producerOpen
                ? t('video_actors_producer_section_hide')
                : t('video_actors_producer_section_show_more') }
            </button>
          </div>
        </div>

        <div className={ `
          ${styles.videoPage__videoDescription}
          ${descriptionOpen ? styles.videoPage__videoDescription__open : ''}
        ` }
          onClick={ () => setDescriptionOpen(!descriptionOpen) }
        >
          { post.description }
          <span className={ styles.videoPage__videoDescriptionShowMore }>
            <button
              className={ styles.videoPage__videoDescriptionShowMoreButton }
              onClick={ () => setDescriptionOpen(!descriptionOpen) }
            >
              { descriptionOpen ? t('video_description_hide') : t('video_description_show_more') }
            </button>
          </span>
        </div>
      </div>

      <span className={ styles.videoPage__relatedVideosTitle }>
        { t('video_related_videos_title') }
      </span>

      <PostCardCarousel posts={ relatedPosts } />

      <PostComments
        postId={ post.id }
        isOpen={ commentsOpen }
        setIsOpen={ setCommentsOpen }
        setCommentsNumber={ setCommentsNumber }
        commentsNumber={ commentsNumber }
      />
    </div>
  )
}
