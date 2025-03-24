import styles from './Home.module.scss'
import dynamic from 'next/dynamic'
import useTranslation from 'next-translate/useTranslation'
import { FC } from 'react'
import { PostCardGallery } from '~/modules/Posts/Infrastructure/Components/PostCardGallery/PostCardGallery'
import { CommonButtonLink } from '~/modules/Shared/Infrastructure/Components/CommonButton/CommonLinkButton'
import { PostCardCarousel } from '~/modules/Posts/Infrastructure/Components/PostCardCarrousel/PostCardCarousel'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import { PostCardOptionConfiguration } from '~/hooks/PostCardOptions'
import {
  CrackrevenuePostPageBanner
} from '~/modules/Shared/Infrastructure/Components/Advertising/Crackrevenue/CrackrevenuePostPageBanner'
import {
  AdsterraResponsiveBanner
} from '~/modules/Shared/Infrastructure/Components/Advertising/AdsterraBanner/AdsterraResponsiveBanner'

const PaginationBar = dynamic(() =>
  import('~/components/PaginationBar/PaginationBar').then((module) => module.PaginationBar)
)

export interface Props {
  posts: Array<PostCardComponentDto>
  trendingPosts: Array<PostCardComponentDto>
}

export const Home: FC<Props> = ({ posts, trendingPosts }) => {
  const { t } = useTranslation('home_page')

  const postCardOptions: PostCardOptionConfiguration[] = [{ type: 'savePost' }, { type: 'react' }]

  const onClickPaginationBar = async (pageNumber: number) => {
    const { push } = (await import('next/router')).default

    await push(`/posts?page=${pageNumber}`)
  }

  return (
    <div className={ styles.home__container }>
      <div className={ styles.home__entryContainer }>
        <div className={ styles.home__entryHeader }>
          <h2 className={ styles.home__entryTitle }>
            { t('home_page_trending_posts_title') }
          </h2>
          <CommonButtonLink
            title={ t('home_page_see_all_section_title') }
            linksProps={ { href: '/posts/top' } }
            rel={ 'follow' }
            border={ true }
          />
        </div>

        <PostCardCarousel
          posts={ trendingPosts }
          postCardOptions={ postCardOptions }
          showData={ false }
          preloadImages={ true }
        />
      </div>

      <CrackrevenuePostPageBanner />

      <div className={ styles.home__entryContainer }>
        <div className={ styles.home__entryHeader }>
          <h2 className={ styles.home__entryTitle }>
            { t('home_page_latest_posts_title') }
          </h2>
          <CommonButtonLink
            title={ t('home_page_see_all_section_title') }
            linksProps={ { href: '/posts' } }
            rel={ 'follow' }
            border={ true }
          />
        </div>
        <PostCardGallery
          posts={ posts }
          showAds={ true }
          postCardOptions={ postCardOptions }
        />
        <PaginationBar
          pageNumber={ 1 }
          pagesNumber={ 5 }
          linkMode={ undefined }
          onPageChange={ onClickPaginationBar }
        />
      </div>

      <AdsterraResponsiveBanner />
    </div>
  )
}
