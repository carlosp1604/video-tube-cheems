import { NextPage } from 'next'
import {
  UserProfileHeaderComponentDto
} from '~/modules/Auth/Infrastructure/ComponentDtos/UserProfileHeaderComponentDto'
import useTranslation from 'next-translate/useTranslation'
import { UserProfile } from '~/components/UserProfile/UserProfile'
import {
  HtmlPageMetaContextProps
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaContextProps'
import {
  HtmlPageMetaContextResourceType,
  HtmlPageMetaResourceService
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaResourceService/HtmlPageMetaResourceService'
import { HtmlPageMeta } from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMeta'
import { useRouter } from 'next/router'

export interface UserProfilePageProps {
  userComponentDto: UserProfileHeaderComponentDto
  htmlPageMetaContextProps: HtmlPageMetaContextProps
}

export const UserProfilePage: NextPage<UserProfilePageProps> = ({ userComponentDto, htmlPageMetaContextProps }) => {
  const { t } = useTranslation('user_profile')
  const { locale } = useRouter()

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    dateCreated: userComponentDto.createdAt,
    dateModified: userComponentDto.updatedAt,
    mainEntity: {
      '@type': 'Person',
      name: userComponentDto.name,
      alternateName: userComponentDto.username,
      identifier: userComponentDto.id,
      ...[userComponentDto.imageUrl ? { image: userComponentDto.imageUrl } : {}],
    },
  }

  const htmlPageMetaUrlProps = (
    new HtmlPageMetaResourceService(
      t('user_profile_page_title', { userName: userComponentDto.name }),
      t('user_profile_page_description', { userName: userComponentDto.name }),
      HtmlPageMetaContextResourceType.ARTICLE,
      null,
      userComponentDto.imageUrl ?? undefined
    )
  ).getProperties()

  const htmlPageMetaProps = {
    ...htmlPageMetaContextProps,
    resourceProps: htmlPageMetaUrlProps,
    structuredData: JSON.stringify(structuredData),
  }

  return (
    <>
      <HtmlPageMeta { ...htmlPageMetaProps } />

      <UserProfile
        key={ locale }
        userComponentDto={ userComponentDto }
      />
    </>
  )
}
