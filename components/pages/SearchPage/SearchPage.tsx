import { NextPage } from 'next'
import { PostsPaginationSortingType } from '~/modules/Posts/Infrastructure/Frontend/PostsPaginationSortingType'
import { useTranslation } from 'next-i18next'
import { Search } from '~/components/Search/Search'
import {
  HtmlPageMetaContextProps
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaContextProps'
import {
  HtmlPageMetaContextResourceType,
  HtmlPageMetaResourceService
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaResourceService/HtmlPageMetaResourceService'
import { HtmlPageMeta } from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMeta'
import { MobileBanner } from '~/modules/Shared/Infrastructure/Components/ExoclickBanner/MobileBanner'

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
  const { t } = useTranslation('search')

  const structuredData = {
    '@context': 'http://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{
      '@type': 'ListItem',
      position: 1,
      name: t('search_page_breadcrumb_title'),
      item: `${baseUrl}/posts/search/`,
    }, {
      '@type': 'ListItem',
      position: 2,
      name: initialSearchTerm,
      item: `${baseUrl}/posts/search/${initialSearchTerm}/`,
    }],
  }

  const htmlPageMetaUrlProps = (
    new HtmlPageMetaResourceService(
      t('search_page_title', { searchTerm: initialSearchTerm }),
      t('search_page_subtitle', { searchTerm: initialSearchTerm }),
      HtmlPageMetaContextResourceType.ARTICLE
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

      <MobileBanner />

      <Search
        initialPage={ initialPage }
        initialSearchTerm={ initialSearchTerm }
        initialSortingOption={ initialSortingOption }
      />
    </>
  )
}
