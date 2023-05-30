import { NextPage } from 'next'
import styles from './ActorsPage.module.scss'
import { ActorComponentDto } from '~/modules/Posts/Infrastructure/Dtos/ActorComponentDto'
import { PaginatedActorCardGallery } from '~/components/PaginatedActorCardGallery/PaginatedActorCardGallery'

export interface ActorsPageProps {
  actors: ActorComponentDto[]
  actorsNumber: number
}

export const ActorsPage: NextPage<ActorsPageProps> = ({ actors, actorsNumber }) => {
  return (
    <div className={ styles.actorsPage__container }>
      <PaginatedActorCardGallery
        initialActorsNumber={ actorsNumber }
        filters={ [] }
        initialActors={ actors }
        title={ 'Actors' }
      />
    </div>
  )
}
