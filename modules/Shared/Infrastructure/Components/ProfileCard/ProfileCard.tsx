import Link from 'next/link'
import styles from './ProfileCard.module.scss'
import useTranslation from 'next-translate/useTranslation'
import { FC } from 'react'
import { useRouter } from 'next/router'
import { AvatarImage } from '~/components/AvatarImage/AvatarImage'
import { NumberFormatter } from '~/modules/Shared/Infrastructure/FrontEnd/NumberFormatter'
import { ProfileCardDto } from '~/modules/Shared/Infrastructure/FrontEnd/ProfileCardDto'

export type ProfileType = 'actors' | 'producers'

export interface Props {
  profile: ProfileCardDto
  type: ProfileType
}

export const ProfileCard: FC<Props> = ({ profile, type }) => {
  const { t } = useTranslation(type)

  const locale = useRouter().locale ?? 'en'

  let href = `/actors/${profile.slug}`

  if (type === 'producers') {
    href = `/producers/${profile.slug}`
  }

  return (
    <div className={ styles.profileCard__container }>
      <div className={ styles.profileCard__imageWrapper }>
        <Link href={ href }>
          <AvatarImage
            imageUrl={ profile.imageUrl }
            avatarClassName={ styles.profileCard__avatar }
            imageClassName={ styles.profileCard__image }
            avatarName={ profile.name }
            imageAlt={ t('profile_card_image_alt_title', { actorName: profile.name }) }
            rounded={ false }
          />
        </Link>
      </div>
      <div className={ styles.profileCard__dataContainer }>
        <Link
          className={ styles.profileCard__name }
          href={ href }
        >
          { profile.name }
        </Link>
        <div className={ styles.profileCard__countSection }>
          { t('profile_card_posts_count_title', { postsNumber: profile.postsNumber }) }
          <span className={ styles.profileCard__viewsTitle }>
            { t('profile_card_views_count_title',
              { viewsNumber: NumberFormatter.compatFormat(profile.viewsNumber, locale) }) }
          </span>
        </div>
      </div>
    </div>

  )
}
