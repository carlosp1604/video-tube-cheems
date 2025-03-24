import styles from '~/styles/pages/CommonPage.module.scss'
import { NextPage } from 'next'
import { PostsPaginationSortingType } from '~/modules/Posts/Infrastructure/Frontend/PostsPaginationSortingType'
import useTranslation from 'next-translate/useTranslation'
import { Search } from '~/components/Search/Search'
import {
  HtmlPageMetaContextProps
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaContextProps'
import {
  HtmlPageMetaContextResourceType,
  HtmlPageMetaResourceService
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaResourceService/HtmlPageMetaResourceService'
import { HtmlPageMeta } from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMeta'
import {
  CrackrevenuePostPageBanner
} from '~/modules/Shared/Infrastructure/Components/Advertising/Crackrevenue/CrackrevenuePostPageBanner'
import {
  AdsterraResponsiveBanner
} from '~/modules/Shared/Infrastructure/Components/Advertising/AdsterraBanner/AdsterraResponsiveBanner'

export interface SearchPageProps {
  initialSearchTerm: string
  initialPage: number
  initialSortingOption: PostsPaginationSortingType
  htmlPageMetaContextProps: HtmlPageMetaContextProps
  baseUrl: string
}

export const SearchPage: NextPage<SearchPageProps> = ({
  initialSearchTerm,
  initialPage,
  initialSortingOption,
  htmlPageMetaContextProps,
  baseUrl,
}) => {
  const { t, lang } = useTranslation('search')

  let canonicalUrl = `${baseUrl}/posts/search/${initialSearchTerm}`

  if (lang !== 'en') {
    canonicalUrl = `${baseUrl}/${lang}/posts/search/${initialSearchTerm}`
  }

  const htmlPageMetaUrlProps = (
    new HtmlPageMetaResourceService(
      t('search_page_title', { searchTerm: initialSearchTerm }),
      t('search_page_subtitle', { searchTerm: initialSearchTerm }),
      HtmlPageMetaContextResourceType.ARTICLE,
      canonicalUrl
    )
  ).getProperties()

  const htmlPageMetaProps = {
    ...htmlPageMetaContextProps,
    resourceProps: htmlPageMetaUrlProps,
  }

  return (
    <div className={ styles.commonPage__container }>
      <HtmlPageMeta { ...htmlPageMetaProps } />

      <CrackrevenuePostPageBanner />

      <Search
        initialPage={ initialPage }
        initialSearchTerm={ initialSearchTerm }
        initialSortingOption={ initialSortingOption }
      />

      <AdsterraResponsiveBanner />
    </div>
  )
}
