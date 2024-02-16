import { NextPage } from 'next'
import { useRouter } from 'next/router'
import styles from '~/components/pages/ActorPage/ActorPage.module.scss'
import { ProfileHeader } from '~/modules/Shared/Infrastructure/Components/ProfileHeader/ProfileHeader'
import {
  Actor
} from '~/modules/Actors/Infrastructure/Components/Actor/Actor'
import { ActorPageComponentDto } from '~/modules/Actors/Infrastructure/ActorPageComponentDto'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import { useTranslation } from 'next-i18next'
import { HtmlPageMeta } from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMeta'
import {
  HtmlPageMetaContextResourceType,
  HtmlPageMetaResourceService
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaResourceService/HtmlPageMetaResourceService'
import {
  HtmlPageMetaContextProps
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaContextProps'
import { useAvatarColor } from '~/hooks/AvatarColor'

export interface ActorPageProps {
  actor: ActorPageComponentDto
  initialPosts: PostCardComponentDto[]
  initialPostsNumber: number
  htmlPageMetaContextProps: HtmlPageMetaContextProps
  baseUrl: string
}

export const ActorPage: NextPage<ActorPageProps> = ({
  actor,
  initialPosts,
  initialPostsNumber,
  htmlPageMetaContextProps,
  baseUrl,
}) => {
  const { asPath } = useRouter()
  const { t } = useTranslation('actors')
  const getRandomColor = useAvatarColor()

  const structuredData = {
    '@context': 'http://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{
      '@type': 'ListItem',
      position: 1,
      name: t('actors_breadcrumb_list_title'),
      item: `${baseUrl}/actors/`,
    }, {
      '@type': 'ListItem',
      position: 2,
      name: actor.name,
      item: `${baseUrl}/actors/${actor.slug}/`,
    }],
  }

  const htmlPageMetaUrlProps = (
    new HtmlPageMetaResourceService(
      t('actor_page_title', { actorName: actor.name }),
      t('actor_page_description', { actorName: actor.name }),
      HtmlPageMetaContextResourceType.ARTICLE,
      actor.imageUrl ?? undefined
    )
  ).getProperties()

  const htmlPageMetaProps = {
    ...htmlPageMetaContextProps,
    resourceProps: htmlPageMetaUrlProps,
    structuredData: JSON.stringify(structuredData),
  }

  return (

    <div className={ styles.actorPage__container }>
      <HtmlPageMeta { ...htmlPageMetaProps } />

      <ProfileHeader
        name={ actor.name }
        imageAlt={ t('actor_image_alt_title', { actorName: actor.name }) }
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
