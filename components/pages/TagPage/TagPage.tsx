import styles from '~/styles/pages/CommonPage.module.scss'
import useTranslation from 'next-translate/useTranslation'
import { NextPage } from 'next'
import { HtmlPageMeta } from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMeta'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import { PostsPaginationSortingType } from '~/modules/Posts/Infrastructure/Frontend/PostsPaginationSortingType'
import {
  HtmlPageMetaContextProps
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaContextProps'
import {
  HtmlPageMetaContextResourceType,
  HtmlPageMetaResourceService
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaResourceService/HtmlPageMetaResourceService'
import { Tag } from '~/modules/PostTag/Infrastructure/Components/Tag/Tag'
import { AppBanner } from '~/modules/Shared/Infrastructure/Components/AppBanner/AppBanner'
import { TagPageComponentDto } from '~/modules/PostTag/Infrastructure/Dtos/TagPageComponentDto'
import {
  AdCashResponsiveBanner
} from '~/modules/Shared/Infrastructure/Components/Advertising/AdCash/AdCashResponsiveBanner'
import {
  ClickAduResponsiveBanner
} from '~/modules/Shared/Infrastructure/Components/Advertising/ClickAdu/ClickAduResponsiveBanner'

export interface TagPageProps {
  page: number
  order: PostsPaginationSortingType
  tag: TagPageComponentDto
  posts: PostCardComponentDto[]
  postsNumber: number
  htmlPageMetaContextProps: HtmlPageMetaContextProps
  baseUrl: string
}

export const TagPage: NextPage<TagPageProps> = ({
  page,
  order,
  tag,
  posts,
  postsNumber,
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

  const htmlPageMetaUrlProps = (
    new HtmlPageMetaResourceService(
      t('tag_page_title', { tagName: tag.name }),
      t('tag_page_description', { tagName: tag.name }),
      HtmlPageMetaContextResourceType.ARTICLE,
      htmlPageMetaContextProps.canonicalUrl
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

      <AdCashResponsiveBanner />

      <Tag
        page={ page }
        order={ order }
        tagName={ tag.name }
        tagSlug={ tag.slug }
        posts={ posts }
        postsNumber={ postsNumber }
      />

      <ClickAduResponsiveBanner />

      <div className={ styles.commonPage__pageBanner }>
        <AppBanner
          title={ t('common:app_banner_title') }
          description={ t('tag_page_banner_description', { tagName: tag.name }) }
          headerTag={ 'h2' }
        />
      </div>
    </div>
  )
}
