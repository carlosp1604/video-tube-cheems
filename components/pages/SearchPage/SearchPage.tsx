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
import { MobileBanner } from '~/modules/Shared/Infrastructure/Components/ExoclickBanner/MobileBanner'
import { useRouter } from 'next/router'

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
  const locale = useRouter().locale ?? 'en'

  let canonicalUrl = `${baseUrl}/posts/search/${initialSearchTerm}`

  if (locale !== 'en') {
    canonicalUrl = `${baseUrl}/${locale}/posts/search/${initialSearchTerm}`
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
