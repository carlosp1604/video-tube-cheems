import { NextPage } from 'next'
import { useState } from 'react'
import { ActorPageComponentDto } from '../../../modules/Actors/Infrastructure/ActorPageComponentDto'
import { PostCardComponentDto } from '../../../modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import { PaginatedPostCardGallery } from '../../PaginatedPostCardGallery/PaginatedPostCardGallery'
import styles from './ActorPage.module.scss'

export interface ActorPageProps {
  actor: ActorPageComponentDto
  posts: PostCardComponentDto[]
  postsNumber: number
}

export const ActorPage: NextPage<ActorPageProps> = ({ actor, posts, postsNumber }) => {
  const [openDescription, setOpenDescription] = useState<boolean>(false)
  const [totalPosts, setTotalPosts] = useState<number>(postsNumber)

  return (
    <div className={ styles.actorPage__container }>
      <div className={ styles.actorPage__actorInfo}>
        <img 
          className={styles.actorPage__actorImage}
          src={actor.imageUrl}
          alt={actor.name}
        />

        <h1 className={ styles.actorPage__actorName }>
          { actor.name }
        </h1>

        <div className={ `
          ${styles.actorPage__actorDescription}
          ${openDescription ? styles.actorPage__actorDescription__open : ''}
          `}
        >
          { actor.description }

          <div className={styles.actorPage__actorDescriptionShowMore}>
            <button
              className={styles.videoPage__actorDescriptionShowMoreButton}
              onClick={() => setOpenDescription(!openDescription)}
            >
              {openDescription ? 'Mostrar menos' : 'Mostrar más'}
            </button>
          </div>
        </div>
      </div>

      <h2 className={styles.actorPage__actorPageTitle}>
        {`Videos de ${actor.name}`}
        <span className={styles.actorPage__postsQuantity}>
          {totalPosts}
        </span>
      </h2>

      <PaginatedPostCardGallery
        posts={ posts }
        postsNumber={ totalPosts }
        setPostsNumber={ setTotalPosts}
        fetchEndpoint={'/api/posts'}
        filters={[ { type: 'actorId', value: actor.id }]}
      />
    </div>
  )
}