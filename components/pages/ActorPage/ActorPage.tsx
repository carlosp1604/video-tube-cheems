import { NextPage } from 'next'
import { useRouter } from 'next/router'
import styles from '~/components/pages/ActorPage/ActorPage.module.scss'
import { ProfileHeader } from '~/modules/Shared/Infrastructure/Components/ProfileHeader/ProfileHeader'
import {
  Actor
} from '~/modules/Actors/Infrastructure/Components/Actor/Actor'
import { ActorPageComponentDto } from '~/modules/Actors/Infrastructure/ActorPageComponentDto'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'

export interface ActorPageProps {
  actor: ActorPageComponentDto
  initialPosts: PostCardComponentDto[]
  initialPostsNumber: number
}

export const ActorPage: NextPage<ActorPageProps> = ({ actor, initialPosts, initialPostsNumber }) => {
  const { asPath } = useRouter()

  return (
    <div className={ styles.actorPage__container }>
      <ProfileHeader
        name={ actor.name }
        imageAlt={ actor.name }
        imageUrl={ actor.imageUrl }
        customColor={ null }
        rounded={ true }
      />

      <Actor
        key={ asPath }
        actorName={ actor.name }
        actorSlug={ actor.slug }
        initialPosts={ initialPosts }
        initialPostsNumber={ initialPostsNumber }
      />
    </div>
  )
}
