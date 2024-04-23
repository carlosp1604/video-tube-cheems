import { NextPage } from 'next'
import {
  UserProfileHeaderComponentDto
} from '~/modules/Auth/Infrastructure/ComponentDtos/UserProfileHeaderComponentDto'
import useTranslation from 'next-translate/useTranslation'
import { UserSavedPosts } from '~/modules/Auth/Infrastructure/Components/UserSavedPosts/UserSavedPosts'
import {
  HtmlPageMetaContextProps
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaContextProps'
import {
  HtmlPageMetaContextResourceType,
  HtmlPageMetaResourceService
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaResourceService/HtmlPageMetaResourceService'
import { HtmlPageMeta } from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMeta'

export interface UserSavedPostsPageProps {
  userComponentDto: UserProfileHeaderComponentDto
  htmlPageMetaContextProps: HtmlPageMetaContextProps
}

export const UserSavedPostsPage: NextPage<UserSavedPostsPageProps> = ({
  userComponentDto,
  htmlPageMetaContextProps,
}) => {
  const { t } = useTranslation('user_profile')

  const htmlPageMetaUrlProps = (
    new HtmlPageMetaResourceService(
      t('user_saved_posts_page_title', { userName: userComponentDto.name }),
      t('user_saved_posts_page_description', { userName: userComponentDto.name }),
      HtmlPageMetaContextResourceType.ARTICLE,
      null,
      userComponentDto.imageUrl ?? undefined
    )
  ).getProperties()

  const htmlPageMetaProps = {
    ...htmlPageMetaContextProps,
    resourceProps: htmlPageMetaUrlProps,
  }

  return (
    <>
      <HtmlPageMeta { ...htmlPageMetaProps } />

      <UserSavedPosts userComponentDto={ userComponentDto } />
     </>
  )
}
