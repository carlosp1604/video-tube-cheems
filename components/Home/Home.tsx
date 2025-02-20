import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import { FC } from 'react'
import { TagCardComponentDto } from '~/modules/PostTag/Infrastructure/Dtos/TagCardComponentDto'
import { PostCardGallery } from '~/modules/Posts/Infrastructure/Components/PostCardGallery/PostCardGallery'
import { PostCardOptionConfiguration } from '~/hooks/PostCardOptions'
import { PostCardCarousel } from '~/modules/Posts/Infrastructure/Components/PostCardCarrousel/PostCardCarousel'
import styles from './Home.module.scss'
import { TagCard } from '~/modules/PostTag/Infrastructure/Components/TagCard/TagCard'
import {
  CrackrevenuePostPageBanner
} from '~/modules/Shared/Infrastructure/Components/Advertising/Crackrevenue/CrackrevenuePostPageBanner'
import {
  AdsterraResponsiveBanner
} from '~/modules/Shared/Infrastructure/Components/Advertising/AdsterraBanner/AdsterraResponsiveBanner'
import useTranslation from 'next-translate/useTranslation'
import { CommonButtonLink } from '~/modules/Shared/Infrastructure/Components/CommonButton/CommonLinkButton'

export interface Props {
  posts: Array<PostCardComponentDto>
  trendingPosts: Array<PostCardComponentDto>
  tags: Array<TagCardComponentDto>
}

export const Home: FC<Props> = ({ posts, trendingPosts, tags }) => {
  const { t } = useTranslation('home_page')
  const postCardOptions: PostCardOptionConfiguration[] = [{ type: 'savePost' }, { type: 'react' }]

  return (
    <section className={ styles.home__container }>
      <div className={ styles.home__entryContainer }>
        <div className={ styles.home__entryHeader }>
          <span className={ styles.home__entryTitle }>
            { t('home_page_trending_posts_title') }
          </span>
          <CommonButtonLink
            title={ t('home_page_see_all_section_title') }
            linksProps={ { href: '/posts/top' } }
            rel={ 'follow' }
          />
        </div>

        <PostCardCarousel
          posts={ trendingPosts }
          postCardOptions={ postCardOptions }
        />
      </div>

      <CrackrevenuePostPageBanner />

      <div className={ styles.home__entryContainer }>
        <div className={ styles.home__entryHeader }>
          <span className={ styles.home__entryTitle }>
            { t('home_page_latest_posts_title') }
          </span>
          <CommonButtonLink
            title={ t('home_page_see_all_section_title') }
            linksProps={ { href: '/posts' } }
            rel={ 'follow' }
          />
        </div>
        <PostCardGallery
          posts={ posts }
          showAds={ false }
          postCardOptions={ postCardOptions }
        />
      </div>

      <AdsterraResponsiveBanner />

      <div className={ styles.home__entryContainer }>
        <div className={ styles.home__entryHeader }>
          <span className={ styles.home__entryTitle }>
            { t('home_page_tags_title') }
          </span>
          <CommonButtonLink
            title={ t('home_page_see_all_section_title') }
            linksProps={ { href: '/tags' } }
            rel={ 'follow' }
          />
        </div>
        <section className={ styles.home__tagsGalleryContainer }>
          { tags.map((tagCardDto) => (
            <TagCard
              key={ tagCardDto.id }
              tagCardDto={ tagCardDto }/>
          )) }
        </section>
      </div>
    </section>
  )
}
