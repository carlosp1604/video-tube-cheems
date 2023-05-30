import { NextPage } from 'next'
import { useState } from 'react'
import styles from './ActorPage.module.scss'
import {
  PaginatedPostCardGallery
} from '~/modules/Posts/Infrastructure/Components/PaginatedPostCardGallery/PaginatedPostCardGallery'
import { ActorPageComponentDto } from '~/modules/Actors/Infrastructure/ActorPageComponentDto'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'

export interface ActorPageProps {
  actor: ActorPageComponentDto
  posts: PostCardComponentDto[]
  postsNumber: number
}

export const ActorPage: NextPage<ActorPageProps> = ({ actor, posts, postsNumber }) => {
  const [openDescription, setOpenDescription] = useState<boolean>(false)

  return (
    <div className={ styles.actorPage__container }>
      <div className={ styles.actorPage__actorInfo }>
        <img
          className={ styles.actorPage__actorImage }
          src={ actor.imageUrl }
          alt={ actor.name }
        />

        <h1 className={ styles.actorPage__actorName }>
          { actor.name }
        </h1>

        <div className={ `
          ${styles.actorPage__actorDescription}
          ${openDescription ? styles.actorPage__actorDescription__open : ''}
          ` }
        >
          { actor.description }

          <div className={ styles.actorPage__actorDescriptionShowMore }>
            <button
              className={ styles.videoPage__actorDescriptionShowMoreButton }
              onClick={ () => setOpenDescription(!openDescription) }
            >
              { openDescription ? 'Mostrar menos' : 'Mostrar más' }
            </button>
          </div>
        </div>
      </div>

      <PaginatedPostCardGallery
        initialPostsNumber={ postsNumber }
        filters={ [] }
        initialPosts={ posts }
        title={ `Videos de ${actor.name}` }
      />
    </div>
  )
}
