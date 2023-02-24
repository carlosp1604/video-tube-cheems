import { NextPage } from 'next'
import { useState } from 'react'
import { ActorComponentDto } from '../../../modules/Actors/Infrastructure/ActorComponentDto'
import { PaginatedActorCardGallery } from '../../PaginatedActorCardGallery/PaginatedActorCardGallery'
import styles from './ActorsPage.module.scss'

export interface ActorsPageProps {
  actors: ActorComponentDto[]
  actorsNumber: number
}

export const ActorsPage: NextPage<ActorsPageProps> = ({ actors, actorsNumber }) => {
  const [totalActors, setTotalActors] = useState<number>(actorsNumber)

  return (
    <div className={styles.actorsPage__container}>
      <h1 className={styles.actorsPage__actorName}>
        Actors
        <span className={styles.actorsPage__actorsQuantity}>
          {`${actorsNumber} ACTORS`}
        </span>
      </h1>
      <PaginatedActorCardGallery 
        actorsNumber={totalActors}
        filters={[]}
        setActorsNumber={setTotalActors}
        actors={actors}
      />
    </div>

  )
}