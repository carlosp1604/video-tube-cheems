import { NextPage } from 'next'
import { ActorCardDto } from '~/modules/Actors/Infrastructure/ActorCardDto'
import { ActorsPaginationSortingType } from '~/modules/Actors/Infrastructure/Frontend/ActorsPaginationSortingType'
import { useTranslation } from 'next-i18next'
import {
  HtmlPageMetaContextResourceType,
  HtmlPageMetaResourceService
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaResourceService/HtmlPageMetaResourceService'
import {
  HtmlPageMetaContextProps
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaContextProps'
import { HtmlPageMeta } from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMeta'
import { Actors } from '~/modules/Actors/Infrastructure/Components/Actors/Actors'

export interface ActorsPageProps {
  initialPage: number
  initialOrder: ActorsPaginationSortingType
  initialActors: ActorCardDto[]
  initialActorsNumber: number
  htmlPageMetaContextProps: HtmlPageMetaContextProps
}

export const ActorsPage: NextPage<ActorsPageProps> = ({
  initialActors,
  initialActorsNumber,
  initialPage,
  initialOrder,
  htmlPageMetaContextProps,
}) => {
  const { t } = useTranslation('actors')

  const htmlPageMetaUrlProps = (
    new HtmlPageMetaResourceService(
      t('actors_page_title'),
      t('actors_page_description'),
      HtmlPageMetaContextResourceType.ARTICLE
    )
  ).getProperties()

  const htmlPageMetaProps = {
    ...htmlPageMetaContextProps,
    resourceProps: htmlPageMetaUrlProps,
  }

  return (
    <>
      <HtmlPageMeta { ...htmlPageMetaProps } />

      <Actors
        initialPage={ initialPage }
        initialOrder={ initialOrder }
        initialActors={ initialActors }
        initialActorsNumber={ initialActorsNumber }
      />
    </>
  )
}
