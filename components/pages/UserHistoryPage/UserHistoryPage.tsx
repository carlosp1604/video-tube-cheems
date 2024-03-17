import { NextPage } from 'next'
import {
  UserProfileHeaderComponentDto
} from '~/modules/Auth/Infrastructure/ComponentDtos/UserProfileHeaderComponentDto'
import { useTranslation } from 'next-i18next'
import { UserHistory } from '~/modules/Auth/Infrastructure/Components/UserHistory/UserHistory'
import {
  HtmlPageMetaContextResourceType,
  HtmlPageMetaResourceService
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaResourceService/HtmlPageMetaResourceService'
import {
  HtmlPageMetaContextProps
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaContextProps'
import { HtmlPageMeta } from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMeta'

export interface UserHistoryPageProps {
  userComponentDto: UserProfileHeaderComponentDto
  htmlPageMetaContextProps: HtmlPageMetaContextProps
}

export const UserHistoryPage: NextPage<UserHistoryPageProps> = ({
  userComponentDto,
  htmlPageMetaContextProps,
}) => {
  const { t } = useTranslation('user_profile')

  const htmlPageMetaUrlProps = (
    new HtmlPageMetaResourceService(
      t('user_history_page_title', { userName: userComponentDto.name }),
      t('user_history_page_description', { userName: userComponentDto.name }),
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

      <UserHistory userComponentDto={ userComponentDto } />
    </>
  )
}
