import { FC, ReactElement } from 'react'
import styles from './ProfileCardGallery.module.scss'
import { defaultPerPage } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationHelper'
import { ProfileCardDto } from '~/modules/Shared/Infrastructure/FrontEnd/ProfileCardDto'
import {
  ProfileCardSkeleton
} from '~/modules/Shared/Infrastructure/Components/ProfileCard/ProfileCardSkeleton/ProfileCardSkeleton'
import { ProfileCard, ProfileType } from '~/modules/Shared/Infrastructure/Components/ProfileCard/ProfileCard'

interface Props {
  profiles: ProfileCardDto[]
  type: ProfileType
  loading: boolean
  emptyState: ReactElement | null
}

export const ProfileCardGallery: FC<Partial<Props> & Pick<Props, 'profiles' | 'type'>> = ({
  profiles,
  type,
  loading = false,
  emptyState = null,
}) => {
  let profilesSkeletonNumber

  if (profiles.length <= defaultPerPage) {
    profilesSkeletonNumber = defaultPerPage - profiles.length
  } else {
    profilesSkeletonNumber = profiles.length % defaultPerPage
  }

  const skeletonProfiles = Array.from(Array(profilesSkeletonNumber).keys())
    .map((index) => (
      <ProfileCardSkeleton key={ index }/>
    ))

  const profileCards = profiles.map((profile) => {
    return (
      <ProfileCard
        profile={ profile }
        type={ type }
        key={ profile.id }
      />
    )
  })

  let content: ReactElement | null = (
    <div className={ `
      ${styles.profileCardGallery__container}
      ${loading ? styles.profileCardGallery__container__loading : ''}
    ` }
    >
      { profileCards }
      { loading ? skeletonProfiles : null }
    </div>
  )

  if (!loading && profiles.length === 0) {
    content = emptyState
  }

  return content
}
