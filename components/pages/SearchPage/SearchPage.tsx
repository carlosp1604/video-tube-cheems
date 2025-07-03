import styles from '~/styles/pages/CommonPage.module.scss'
import useTranslation from 'next-translate/useTranslation'
import { Search } from '~/components/Search/Search'
import { NextPage } from 'next'
import { PostsPaginationSortingType } from '~/modules/Posts/Infrastructure/Frontend/PostsPaginationSortingType'
import {
  HtmlPageMetaContextProps
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaContextProps'
import {
  HtmlPageMetaContextResourceType,
  HtmlPageMetaResourceService
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaResourceService/HtmlPageMetaResourceService'
import { HtmlPageMeta } from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMeta'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import {
  AdCashResponsiveBanner
} from '~/modules/Shared/Infrastructure/Components/Advertising/AdCash/AdCashResponsiveBanner'

export interface SearchPageProps {
  initialSearchTerm: string
  initialPage: number
  posts: PostCardComponentDto[]
  postsNumber: number
  asPath: string
  initialSortingOption: PostsPaginationSortingType
  htmlPageMetaContextProps: HtmlPageMetaContextProps
}

export const SearchPage: NextPage<SearchPageProps> = ({
  initialSearchTerm,
  initialPage,
  initialSortingOption,
  posts,
  postsNumber,
  asPath,
  htmlPageMetaContextProps,
}) => {
  const { t } = useTranslation('search')

  const htmlPageMetaUrlProps = (
    new HtmlPageMetaResourceService(
      t('search_page_title', { searchTerm: initialSearchTerm }),
      t('search_page_subtitle', { searchTerm: initialSearchTerm }),
      HtmlPageMetaContextResourceType.ARTICLE,
      htmlPageMetaContextProps.canonicalUrl
    )
  ).getProperties()

  const htmlPageMetaProps = {
    ...htmlPageMetaContextProps,
    resourceProps: htmlPageMetaUrlProps,
  }

  return (
    <div className={ styles.commonPage__container }>
      <HtmlPageMeta { ...htmlPageMetaProps } />

      <AdCashResponsiveBanner />

      <Search
        key={ asPath }
        page={ initialPage }
        searchTerm={ initialSearchTerm }
        sortingOption={ initialSortingOption }
        posts={ posts }
        postsNumber={ postsNumber }
      />
    </div>
  )
}
