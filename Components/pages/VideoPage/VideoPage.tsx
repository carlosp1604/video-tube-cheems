import { NextPage } from 'next'
import videojs from 'video.js'
import styles from './VideoPage.module.scss'
import { useState, useRef } from 'react'
import {
  BsArrowUpRight,
  BsBookmarks,
  BsChatSquareText,
  BsCursor,
  BsDownload,
  BsHeart,
  BsMegaphone
} from 'react-icons/bs'
import { PostComponentDto } from '../../../modules/Posts/Infrastructure/Dtos/PostComponentDto'
import { VideoPlayer } from '../../VideoPlayer/VideoPlayer'
import { TagList } from '../../../modules/Posts/Infrastructure/Components/TagList'
import { PostComments } from '../../../modules/Posts/Infrastructure/Components/PostComments'
import { PostCardCarousel } from '../../../modules/Posts/Infrastructure/Components/PostCardCarousel'
import { PostCardComponentDto } from '../../../modules/Posts/Infrastructure/Dtos/PostCardComponentDto'

export interface VideoPageProps {
  post: PostComponentDto
  relatedPosts: PostCardComponentDto[]
}

export const VideoPage: NextPage<VideoPageProps> = ({ post, relatedPosts }) => {
  const [reactionsNumber, setReactionsNumber] = useState<number>(post.reactions)
  const [commentsNumber, setCommentsNumber] = useState<number>(post.comments)
  const [descriptionOpen, setDescriptionOpen] = useState<boolean>(false)
  const [producerOpen, setProducerOpen] = useState<boolean>(false)
  const [commentsOpen, setCommentsOpen] = useState<boolean>(false)

  const videoNode = useRef<HTMLVideoElement>(null)

  const videoJsOptions: videojs.PlayerOptions = {
    sources: post.video.qualities.map((videoQuality) => {
      return {
        src: videoQuality.value,
        type: 'type/mp4'
      }
    }),
    poster: post.video.poster,
  }

  let producerSection: React.ReactElement | string = ''
  let actorsSection: React.ReactElement[] | string = ''

  if (post.producer !== null) {
    producerSection = (
      <div className={styles.videoPage__producerItem}>              
        <img
          alt={post.producer.name}
          className={ styles.videoPage__producerLogo }
          src={post.producer.imageUrl}
        />
        <span className={styles.videoPage__producerName}>
          {post.producer.name}
          <a
            href={'/'}
            className={styles.videoPage__profile}>
            Perfil
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
          className={styles.videoPage__actorsItem}
          key={actor.id}
        >
          <img
            className={ styles.videoPage__actorLogo}
            src={actor.imageUrl}
            alt={actor.name}
          />
          <span className={styles.videoPage__actorName}>
          {actor.name}
            <a
              href={`/actors/${actor.id}`}
              className={styles.videoPage__profile}
            >
              Perfil
              <BsArrowUpRight />
            </a>
          </span>
        </div>
      )
    })
  }

  return (
    <div className={ styles.videoPage__container }>
      <div className={ styles.videoPage__leftContainer }>
        <VideoPlayer
          options={videoJsOptions}
          videoNode={videoNode}
        />

        <div className={ styles.videoPage__videoData }>
          <h1 className={ styles.videoPage__videoTitle }>
            { post.title }
          </h1>

          <div
            className={`
            ${styles.videoPage__videoComments}
            ${commentsOpen ? styles.videoPage__videoComments__open : ''}
            `}>
          </div>

          <div className={ styles.videoPage__videoInfo}>
              <span className={ styles.videoPage__videoInfoItem}>
                { post.date }
              </span>
              <span className={ styles.videoPage__videoInfoItem}>
                { `${post.views} views` }
              </span>
              <span className={ styles.videoPage__videoInfoItem}>
                { reactionsNumber } <BsHeart />
              </span>
              {
              <span className={ styles.videoPage__videoInfoItem}>
                { commentsNumber } <BsChatSquareText />
              </span>
              }
          </div>

          <div className={ styles.videoPage__videoOptions}>
            <span className={ styles.videoPage__videoOptionIcon}>
              <BsHeart className={ styles.videoPage__heartIcon}/>
            </span>
            <span
              className={ styles.videoPage__videoOptionIcon}
              onClick={() => setCommentsOpen(!commentsOpen)}
            >
            <BsChatSquareText className={ styles.videoPage__commentIcon}/>
            </span>
            <span className={ styles.videoPage__videoOptionIcon}>
              <BsCursor className={ styles.videoPage__shareIcon}/>
            </span>

            <span className={ styles.videoPage__videoOptionIcon}>
              <BsBookmarks className={ styles.videoPage__saveIcon}/>
            </span>
            <span className={ styles.videoPage__videoOptionIcon}>
              <BsDownload className={ styles.videoPage__downloadIcon}/>
            </span>
            <span className={ styles.videoPage__videoOptionIcon}>
              <BsMegaphone className={ styles.videoPage__reportIcon}/>
            </span>

          </div>

          <div className={ `
            ${styles.videoPage__videoActorTagsCat}
            ${producerOpen ? styles.videoPage__videoActorTagsCat__open : ''}
          `}
          onClick={() => setProducerOpen(!producerOpen)}
          >
            <div className={ styles.videoPage__dataItem}>
              { post.producer !== null ? 'Productor' : ''}
              { producerSection }

            </div>

            <div className={ styles.videoPage__dataItem}>
              { post.actors.length > 0 ? 'Actores' : ''}
              { actorsSection }
            </div>

            <div className={ styles.videoPage__dataItem}>
              { post.tags.length > 0 ? 'Tags' : '' }
              <TagList tags={post.tags} />
            </div>

            <div className={styles.videoPage__videoActorTagsCatShowMore}>
              <button
                className={styles.videoPage__videoActorTagsShowMoreButton}
                onClick={() => setProducerOpen(!producerOpen)}
              >
                {producerOpen ? 'Mostrar menos' : 'Mostrar más'}
              </button>
            </div>
          </div>

          <div className={ `
            ${styles.videoPage__videoDescription}
            ${descriptionOpen ? styles.videoPage__videoDescription__open : ''}
          `}
            onClick={() => setDescriptionOpen(!descriptionOpen)}
          >
            { post.description }
            <span className={styles.videoPage__videoDescriptionShowMore}>
              <button
                className={styles.videoPage__videoDescriptionShowMoreButton}
                onClick={() => setDescriptionOpen(!descriptionOpen)}
              >
                {descriptionOpen ? 'Ocultar Descripción' : 'Mostrar Descripción'}
              </button>
            </span>
          </div>
        </div>
      </div>
      
      <div className={styles.videoPage__rightContainer}>
        <span className={styles.videoPage__relatedVideosTitle}>
          Related videos
        </span>
        <PostCardCarousel posts={relatedPosts} /> 
      </div>

      <PostComments
        postId={post.id}
        isOpen={commentsOpen}
        setIsOpen={setCommentsOpen}
        setCommentsNumber={setCommentsNumber}
        commentsNumber={commentsNumber}
      />
    </div>
  )
}