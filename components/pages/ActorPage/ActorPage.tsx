import styles from '~/styles/pages/CommonPage.module.scss'
import { Actor } from '~/modules/Actors/Infrastructure/Components/Actor/Actor'
import { NextPage } from 'next'
import { HtmlPageMeta } from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMeta'
import { ProfileHeader } from '~/modules/Shared/Infrastructure/Components/ProfileHeader/ProfileHeader'
import useTranslation from 'next-translate/useTranslation'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import { ActorPageComponentDto } from '~/modules/Actors/Infrastructure/ActorPageComponentDto'
import {
  HtmlPageMetaContextResourceType,
  HtmlPageMetaResourceService
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaResourceService/HtmlPageMetaResourceService'
import {
  HtmlPageMetaContextProps
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaContextProps'
import { BsStarFill } from 'react-icons/bs'
import { NumberFormatter } from '~/modules/Shared/Infrastructure/FrontEnd/NumberFormatter'
import { AppBanner } from '~/modules/Shared/Infrastructure/Components/AppBanner/AppBanner'
import { PostsPaginationSortingType } from '~/modules/Posts/Infrastructure/Frontend/PostsPaginationSortingType'
import {
  TrafficstarsResponsiveBanner
} from '~/modules/Shared/Infrastructure/Components/Advertising/Trafficstars/TrafficstarsResponsiveBanner'
import {
  AdsterraResponsiveBanner
} from '~/modules/Shared/Infrastructure/Components/Advertising/AdsterraBanner/AdsterraResponsiveBanner'

export interface ActorPageProps {
  page: number
  order: PostsPaginationSortingType
  actor: ActorPageComponentDto
  posts: PostCardComponentDto[]
  postsNumber: number
  htmlPageMetaContextProps: HtmlPageMetaContextProps
  baseUrl: string
}

export const ActorPage: NextPage<ActorPageProps> = ({
  page,
  order,
  actor,
  posts,
  postsNumber,
  htmlPageMetaContextProps,
  baseUrl,
}) => {
  const { t, lang } = useTranslation('actors')

  const structuredData = {
    '@context': 'http://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{
      '@type': 'ListItem',
      position: 1,
      name: t('actors_breadcrumb_list_title'),
      item: `${baseUrl}/${lang}/actors`,
    }, {
      '@type': 'ListItem',
      position: 2,
      name: actor.name,
      item: `${baseUrl}/${lang}/actors/${actor.slug}`,
    }],
  }

  const htmlPageMetaUrlProps = (
    new HtmlPageMetaResourceService(
      t('actor_page_title', { actorName: actor.name }),
      t('actor_page_description', { actorName: actor.name }),
      HtmlPageMetaContextResourceType.ARTICLE,
      htmlPageMetaContextProps.canonicalUrl,
      actor.imageUrl ?? undefined
    )
  ).getProperties()

  const htmlPageMetaProps = {
    ...htmlPageMetaContextProps,
    resourceProps: htmlPageMetaUrlProps,
    structuredData: JSON.stringify(structuredData),
  }

  return (
    <div className={ styles.commonPage__container }>
      <HtmlPageMeta { ...htmlPageMetaProps } />

      <AdsterraResponsiveBanner />

      <ProfileHeader
        name={ actor.name }
        imageAlt={ t('actor_image_alt_title', { actorName: actor.name }) }
        imageUrl={ actor.imageUrl }
        profileType={ t('actor_page_profile_type_title') }
        icon={ <BsStarFill/> }
        subtitle={ t('actor_page_profile_count_title',
          { viewsNumber: NumberFormatter.compatFormat(actor.viewsCount, lang) }) }
        color={ actor.imageUrl ? undefined : 'black' }
      />

      <Actor
        actorId={ actor.id }
        actorName={ actor.name }
        actorSlug={ actor.slug }
        posts={ posts }
        postsNumber={ postsNumber }
        page={ page }
        order={ order }
      />

      <TrafficstarsResponsiveBanner />

      <div className={ styles.commonPage__pageBanner }>
        <AppBanner
          title={ t('common:app_banner_title') }
          headerTag={ 'h2' }
          description={ t('actor_page_banner_description', { actorName: actor.name }) }
        />
      </div>
    </div>
  )
}
