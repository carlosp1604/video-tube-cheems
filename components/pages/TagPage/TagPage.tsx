import { NextPage } from 'next'
import styles from '~/styles/pages/CommonPage.module.scss'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import { PostsPaginationSortingType } from '~/modules/Posts/Infrastructure/Frontend/PostsPaginationSortingType'
import useTranslation from 'next-translate/useTranslation'
import {
  HtmlPageMetaContextProps
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaContextProps'
import {
  HtmlPageMetaContextResourceType,
  HtmlPageMetaResourceService
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaResourceService/HtmlPageMetaResourceService'
import { Tag } from '~/modules/PostTag/Infrastructure/Components/Tag/Tag'
import { HtmlPageMeta } from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMeta'
import { ProfileHeader } from '~/modules/Shared/Infrastructure/Components/ProfileHeader/ProfileHeader'
import { TagPageComponentDto } from '~/modules/PostTag/Infrastructure/Dtos/TagPageComponentDto'
import { AiOutlineTag } from 'react-icons/ai'
import {
  CrackrevenuePostPageBanner
} from '~/modules/Shared/Infrastructure/Components/Advertising/Crackrevenue/CrackrevenuePostPageBanner'
import {
  AdsterraResponsiveBanner
} from '~/modules/Shared/Infrastructure/Components/Advertising/AdsterraBanner/AdsterraResponsiveBanner'

export interface TagPageProps {
  initialPage: number
  initialOrder: PostsPaginationSortingType
  tag: TagPageComponentDto
  initialPosts: PostCardComponentDto[]
  initialPostsNumber: number
  htmlPageMetaContextProps: HtmlPageMetaContextProps
  baseUrl: string
}

export const TagPage: NextPage<TagPageProps> = ({
  initialPage,
  initialOrder,
  tag,
  initialPosts,
  initialPostsNumber,
  htmlPageMetaContextProps,
  baseUrl,
}) => {
  const { t, lang } = useTranslation('tags')

  const structuredData = {
    '@context': 'http://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{
      '@type': 'ListItem',
      position: 1,
      name: tag.name,
      item: `${baseUrl}/${lang}/tags/${tag.slug}`,
    }],
  }

  let canonicalUrl = `${baseUrl}/tags/${tag.slug}`

  if (lang !== 'en') {
    canonicalUrl = `${baseUrl}/${lang}/tags/${tag.slug}`
  }

  const htmlPageMetaUrlProps = (
    new HtmlPageMetaResourceService(
      t('tag_page_title', { tagName: tag.name }),
      t('tag_page_description', { tagName: tag.name }),
      HtmlPageMetaContextResourceType.ARTICLE,
      canonicalUrl
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

      <CrackrevenuePostPageBanner />

      <ProfileHeader
        name={ tag.name }
        imageAlt={ t('tag_image_alt_title', { tagName: tag.name }) }
        imageUrl={ tag.imageUrl }
        profileType={ t('tag_page_profile_type_title') }
        icon={ <AiOutlineTag /> }
        subtitle={ '' }
      />

      <Tag
        initialPage={ initialPage }
        initialOrder={ initialOrder }
        tag={ tag }
        initialPosts={ initialPosts }
        initialPostsNumber={ initialPostsNumber }
      />

      <AdsterraResponsiveBanner />
    </div>
  )
}
